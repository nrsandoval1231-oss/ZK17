"""Make a small, deterministic atmospheric texture; no photographic pixels."""
from PIL import Image, ImageFilter
import math
import random

rng = random.Random(1726)
size = (512, 256)
fields = []
for dimensions in [(8, 4), (16, 8), (32, 16)]:
    field = Image.new('L', dimensions)
    field.putdata([rng.randrange(256) for _ in range(dimensions[0] * dimensions[1])])
    fields.append(field.resize(size, Image.Resampling.BICUBIC))
alpha = Image.new('L', size)
values = []
for y in range(size[1]):
    for x in range(size[0]):
        noise = sum(field.getpixel((x, y)) * weight for field, weight in zip(fields, (.55, .3, .15)))
        envelope = math.sin(math.pi * x / (size[0] - 1)) ** .45 * math.sin(math.pi * y / (size[1] - 1)) ** .65
        values.append(round(max(0, noise - 70) * envelope * .8))
alpha.putdata(values)
texture = Image.new('RGBA', size, (192, 185, 201, 0))
texture.putalpha(alpha.filter(ImageFilter.GaussianBlur(2)))
texture.save('public/media/arrival-directors-smoke.png', optimize=True)
