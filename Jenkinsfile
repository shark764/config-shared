#!groovy​
@Library('sprockets@2.1.0') _

import common
import git
import node

def service = 'Config-Shared'
def c = new common()
def g = new git()
def n = new node()

node() {
pwd = pwd()
echo pwd
 }

if (pwd ==~ /.*PR.*/ ) {
  node() {
    try {
      timeout(time: 1, unit: 'HOURS') {
        ansiColor('xterm') {
          stage ('SCM Checkout') {
            g.checkOut()
          }
          stage ('Export Properties') {
            n.export()
            pr_version = readFile('version')
            c.setDisplayName("${pr_version}")
          }
          stage ('Test') {
            sh 'bower install && npm install'
            sh 'gulp build'
          }
        }
      }
    }
    catch (err) {
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally {
      c.cleanup()
    }
  }
}
else if (pwd ==~ /.*master.*/ ) {
  node() {
    try {
      timeout(time: 1, unit: 'HOURS') {
        ansiColor('xterm') {
          stage ('SCM Checkout') {
            g.checkOutFrom("${service}")
          }
          stage ('Export Properties') {
            n.export()
            build_version = readFile('version')
            c.setDisplayName("${build_version}")
          }
          stage ('Build') {
            sh 'bower install && npm install'
            sh 'gulp build'
          }
          stage ('Push to Github') {
            sh 'git checkout -b build-${BUILD_TAG}'
            sh 'git add -f dist/* '
            sh "git commit -m 'release ${build_version}'"
            //if (build_version.contains("SNAPSHOT")) {
              sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
            //}
            sh "git tag -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
            sh "git push origin ${build_version}"
          }
        }
      }
    }
    catch (err) {
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally {
      c.cleanup()
    }
  }
}
else {
  stage ('Error')
  error 'No Stage'
}