/* pipeline for jenkins (see https://github.com/mborne/docker-devstacks) */
pipeline {
    agent {
        label 'docker'
    }
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t postgis-integration .'
            }
        }
        stage('Init database') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-init'
            }
        }
        stage('Import adminexpress') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import adminexpress'
            }
        }
        stage('Import ban') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import ban'
            }
        }
        stage('Import cadastre-etalab') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import cadastre-etalab'
            }
        }
        stage('Import codes-postaux') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import codes-postaux'
            }
        }
        stage('Import cog-commune') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import cog-commune'
            }
        }
        stage('Import geosirene') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import geosirene'
            }
        }
        stage('Import naturalearth') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import naturalearth'
            }
        }
        stage('Import service-public') {
            steps {
                sh 'docker run --rm --network webgateway postgis-integration npm run postgis-import service-public'
            }
        }        
    }
}

