precision mediump float;

uniform vec2  iResolution;
uniform float iGlobalTime;

#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: smin   = require('glsl-smooth-min')
#pragma glslify: camera = require('./')

float doModel(vec3 p) {
  float sphere = length(p - vec3(0, sin(iGlobalTime) + 0.6, 0)) - 1.0;
  float ground = p.y - 0.0;

  return smin(sphere, ground, 1.0);
}

vec3 doMaterial(vec3 pos, vec3 nor) {
  return vec3(0.4, 0.768, 1.0) * 0.5;
}

vec3 doLighting(vec3 pos, vec3 nor, vec3 rd, float dis, vec3 mal) {
  vec3 lin = vec3(0.0);

  vec3  lig = normalize(vec3(1.0,0.7,0.9));
  float dif = max(dot(nor,lig),0.0);

  lin += dif*vec3(4.00,4.00,4.00);
  lin += vec3(0.50,0.50,0.50);

  vec3 col = mal*lin;

  col *= exp(-0.04*dis*dis);

  return col;
}

float calcIntersection(vec3 ro, vec3 rd) {
  const float maxd = 15.0;
  const float precis = 0.01;
  float h = precis*2.0;
  float t = 0.0;
  float res = -1.0;
  for (int i=0; i<30; i++) {
    if (h < precis || t > maxd) break;
    h = doModel(ro+rd*t);
    t += h;
  }

  if (t < maxd) res = t;
  return res;
}

vec3 calcNormal(vec3 pos) {
  const float eps = 0.002;

  const vec3 v1 = vec3( 1.0,-1.0,-1.0);
  const vec3 v2 = vec3(-1.0,-1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0,-1.0);
  const vec3 v4 = vec3( 1.0, 1.0, 1.0);

  return normalize( v1*doModel( pos + v1*eps ) +
                    v2*doModel( pos + v2*eps ) +
                    v3*doModel( pos + v3*eps ) +
                    v4*doModel( pos + v4*eps ) );
}

void main() {
  float cameraAngle  = 0.8 * iGlobalTime;
  vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
  vec3  rayTarget    = vec3(0, 0, 0);
  vec2  screenPos    = square(iResolution);
  vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, 2.0);

  vec3  col = vec3(0.0);
  float t   = calcIntersection(rayOrigin, rayDirection);

  if (t > -0.5) {
    vec3 pos = rayOrigin + t*rayDirection;
    vec3 nor = calcNormal(pos);
    vec3 mal = doMaterial(pos, nor);

    col = doLighting(pos, nor, rayDirection, t, mal);
  }

  col = pow(clamp(col,0.0,1.0), vec3(0.4545));

  gl_FragColor = vec4( col, 1.0 );
}
