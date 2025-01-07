terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"
}
provider "aws" {
  region = var.AWS_REGION
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY

  default_tags {
    tags = {
      Environment = "production"
      Project     = "lazy-rest"
      Name        = "lazy-rest"
    }
  }
}
resource "aws_s3_bucket" "app_artifacts" {
  bucket        = "lazy-rest-artifacts"
  force_destroy = true
}
resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = aws_s3_bucket.app_artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
data "aws_iam_user" "github_user" {
  user_name = "Github"
}
data "aws_iam_policy_document" "github_s3" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject"
    ]
    resources = [
      aws_s3_bucket.app_artifacts.arn,
      "${aws_s3_bucket.app_artifacts.arn}/*"
    ]
  }
}
resource "aws_iam_user_policy" "github_s3_access" {
  name   = "github-s3-access"
  user   = data.aws_iam_user.github_user.user_name
  policy = data.aws_iam_policy_document.github_s3.json
}