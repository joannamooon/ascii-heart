#include <math.h>
#include <stdio.h>
#include <unistd.h>

int main() {
  float timeStep = 0;
  while (1) {
    float depthBuffer[100 * 40] = {0};
    float maxDepth = 0, cosTheta = cos(timeStep), sinTheta = sin(timeStep);
    for (float posY = -0.5f; posY <= 0.5f; posY += 0.01f) {
      float radius = 0.4f + 0.05f * pow(0.5f + 0.5f * sin(timeStep * 6 + posY * 2), 8);
      for (float posX = -0.5f; posX <= 0.5f; posX += 0.01f) {
        float z = -posX * posX - pow(1.2f * posY - fabs(posX) * 2 / 3, 2) + radius * radius;
        if (z < 0)
          continue;
        z = sqrt(z) / (2 - posY);
        for (float tempDepth = -z; tempDepth <= z; tempDepth += z / 6) {
          float rotatedX = posX * cosTheta - tempDepth * sinTheta;
          float projectedZ = posX * sinTheta + tempDepth * cosTheta;
          float perspective = 1 + projectedZ / 2;
          int viewportX = lroundf((rotatedX * perspective + 0.5f) * 80 + 10);
          int viewportY = lroundf((-posY * perspective + 0.5f) * 39 + 2);
          int bufferIndex = viewportX + viewportY * 100;
          if (depthBuffer[bufferIndex] <= projectedZ) {
            depthBuffer[bufferIndex] = projectedZ;
            if (maxDepth <= projectedZ)
              maxDepth = projectedZ;
          }
        }
      }
    }
    printf("\x1b[H");
    for (int i = 0; i < 100 * 40; i++)
      putchar(i % 100 ? " .,-~:;=!*#$@@"[lroundf(depthBuffer[i] / maxDepth * 13)] : '\n');
    timeStep += 0.003f;
    usleep(3000);
  }
  return 0;
}
