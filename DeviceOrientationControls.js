import * as THREE from 'three';

class DeviceOrientationControls {
    constructor(camera, paramObject) {
        this.body = paramObject.body;
        this.mesh = paramObject.mesh;

        this.camera = camera;
        this.enabled = true;
        this.sensorDetected = false;
        this.onSensorDetected = () => {};

        this.q = new THREE.Quaternion();

        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);

        window.addEventListener('deviceorientation', this.onDeviceOrientation, false);

        this.connect();
    }

    onDeviceOrientation(event) {
        if (!event.alpha || !event.beta || !event.gamma) {
            console.warn('Device orientation event does not have alpha, beta, or gamma.');
            return;
        }

        if (!this.sensorDetected) {
            this.sensorDetected = true;
            this.onSensorDetected();
        }

        if (this.enabled) {
            const alpha = THREE.MathUtils.degToRad(event.alpha); // Z
            const beta = THREE.MathUtils.degToRad(event.beta); // X'
            const gamma = THREE.MathUtils.degToRad(event.gamma); // Y''

            const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
            this.q.setFromEuler(euler);
        }
    }

    connect() {
        this.enabled = true;
    }

    disconnect() {
        this.enabled = false;
        window.removeEventListener('deviceorientation', this.onDeviceOrientation, false);
    }
}

export { DeviceOrientationControls };