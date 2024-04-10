resource "aws_s3_bucket" "bucket" {
  bucket = "mattgarber.dev"
}

resource "aws_cloudfront_origin_access_identity" "cloudfront_origin_access_identity" {
  comment = "Cloudfront origin access identity for mattgarber.dev website"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   = "s3_${aws_s3_bucket.bucket.id}_origin_id"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cloudfront_origin_access_identity.id
    }
  }

  enabled             = true
  default_root_object = "index.html"
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for mattgarber.dev website"

  default_cache_behavior {
    target_origin_id       = "s3_${aws_s3_bucket.bucket.id}_origin_id"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods = ["GET", "HEAD"]

    // Define the cache behavior settings
    min_ttl = 0
    default_ttl = 86400  // Example: 24 hours
    max_ttl = 31536000

    // Configure the forwarded values
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    // Enable compression to improve the performance
    compress = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
