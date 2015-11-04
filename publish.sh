#!/bin/bash

set -exuo pipefail

SERVICE_NAME=freetextsearch
REGION=eu-west-1
S3_BASE_URL=as24-artifacts

ME=`basename $0`
OS=`uname`
if [ "$OS" = "Darwin" ] ; then
    MYFULL="$0"
else
    MYFULL=`readlink -sm $0`
fi
MYDIR=`dirname $MYFULL`

fail()
{
  echo "[$ME] FAIL: $*"
  exit 1
}



echo "[$ME] Packaging the source code"


tar czf ${SERVICE_NAME}-${GO_PIPELINE_LABEL}.tgz freesearchUI searchParser

SERVICE_ARTEFACT="${SERVICE_NAME}-${GO_PIPELINE_LABEL}.tgz"
[ -f "${SERVICE_ARTEFACT}" ] || fail "Artefact doesn't exist: ${SERVICE_ARTEFACT}"


echo "[$ME] Uploading [$SERVICE_NAME] artefacts to S3"
aws --region "${REGION}" s3 cp "${SERVICE_ARTEFACT}" "s3://${S3_BASE_URL}-${REGION}/${SERVICE_NAME}/"


echo ${GO_PIPELINE_LABEL} > deploy/${SERVICE_NAME}-service.version
