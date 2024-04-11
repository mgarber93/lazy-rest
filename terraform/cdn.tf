provider "aws" {
  region     = "us-east-1"
}

locals {
  site = "lazy-rest.com"
}

resource "aws_acm_certificate" "cert" {
  domain_name               = local.site
  subject_alternative_names = ["*.${local.site}"]
  validation_method         = "DNS"

  tags = {
    Name = "lazy-rest-ssl-certificate"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  // │ Elements of a set are identified only by their value and don't have any separate index or key to select with, so it's only possible to perform operations across all elements of the set.
  name    = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_name
  type    = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_type
  zone_id = "Z05410901PMU87KKB8A64"
  records = [tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation.fqdn]
}
module "bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "lazy-rest"
  policy = <<POLICY
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::lazy-rest/*"
      }
    ]
  }
  POLICY
}

module "cdn" {
  source = "terraform-aws-modules/cloudfront/aws"

  #   aliases = [""]

  comment = "CloudFront"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  wait_for_deployment = false

  create_origin_access_identity = true
  origin_access_identities = {
    s3_bucket_one = "CloudFront can access"
  }

  origin = {
    webfront = {
      domain_name = module.bucket.s3_bucket_bucket_domain_name
      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "match-viewer"
        origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "webfront"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = true
  }

  viewer_certificate = {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }

  depends_on = [aws_acm_certificate_validation.cert]
}