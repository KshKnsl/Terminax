import React from 'react'
import { useParams } from 'react-router-dom'

const DeploymentPage = () => {
    const { deploymentId } = useParams<{ deploymentId: string }>()

    return (
        <div>Deployment ID: {deploymentId}</div>
    )
}

export default DeploymentPage