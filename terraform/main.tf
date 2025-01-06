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
  region = "us-east-2"
}

resource "aws_s3_bucket" "app_artifacts" {
  bucket = "my-app-artifacts"
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket                  = aws_s3_bucket.app_artifacts.id
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