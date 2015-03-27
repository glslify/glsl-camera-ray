# glsl-camera-ray

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Generates a ray for [Shadertoy](http://shadertoy.com)-style raycasting in GLSL.
Accepts either either a camera origin/target or an arbitrary `mat3` matrix.

## Usage

[![NPM](https://nodei.co/npm/glsl-camera-ray.png)](https://nodei.co/npm/glsl-camera-ray/)

### `vec3 cameraRay(vec3 ro, vec3 ta, vec2 screen, float lens)`

* `vec3 ro` is the position of the camera.
* `vec3 ta` is the position the camera is pointing towards.
* `vec2 screen` is the position of the fragment on the screen, generally between -1 and 1. For non-square frames you'll want to normalize this using something like [glsl-square-frame](http://github.com/hughsk/glsl-square-frame)
* `lens` is the lens length of the camera. This works
  similarly to FOV, where `0.0` is horribly wide and `2.0`
  is a decent default.

``` glsl
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: camera = require('glsl-camera-ray')

uniform vec2  iResolution;
uniform float iGlobalTime;

void main() {
  // Bootstrap a Shadertoy-style raytracing scene:
  float cameraAngle  = 0.8 * iGlobalTime;
  vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
  vec3  rayTarget    = vec3(0, 0, 0);
  vec2  screenPos    = square(iResolution.xy);
  float lensLength   = 2.0;

  vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, lensLength);
  // ...
}
```

### `vec3 cameraRay(mat3 camera, vec2 screen, float lens)`

For more flexibility, you can supply `mat3 camera` in place
of `vec3 ro, vec3 ta`. This way, you can use your own camera
modules alongside `glsl-camera-ray`.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/glsl-camera-ray/blob/master/LICENSE.md) for details.
