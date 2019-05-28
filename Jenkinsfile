pipeline {
    agent { label 'docker' }

    stages {
        stage('Build and push image') {
            steps {
                script {
                    def app = docker.build('mborne/postgis-integration')
                    app.push("latest")
                }
            }
        }
    }
}
