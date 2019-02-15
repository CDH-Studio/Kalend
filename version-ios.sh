#!/usr/bin/env bash -e

PROJECT_DIR="ios/Kalend"
INFOPLIST_FILE="Info.plist"
INFOPLIST_DIR="${PROJECT_DIR}/${INFOPLIST_FILE}"

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

BRANCH_NAME=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)

BUILD_NUMBER=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${INFOPLIST_DIR}")
BUILD_NUMBER=$(git rev-list ${BRANCH_NAME} --first-parent --count)

# Update plist with new values
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${PACKAGE_VERSION#*v}" "${INFOPLIST_DIR}"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "${INFOPLIST_DIR}"