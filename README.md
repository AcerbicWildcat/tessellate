[![Stories in Ready](https://badge.waffle.io/AcerbicWildcat/tessellate.png?label=ready&title=Ready)](https://waffle.io/AcerbicWildcat/tessellate)
# tessellate

A real-time photo mosaic app that event attendees can contribute to. The mosaic is generated and refined dynamically as event attendees add more photos for the app to work with.

## Features

Create custom event tag (MVP)
Upload via Instagram (MVP)
Join an event (MVP)
Upload from Facebook
Upload from Twitter
Native upload from phone (MVP)
Select target mosaic (MVP)
Generate random mosaic
modally display clicked image (MVP)
Minimum resolution & reshuffle on resize (MVP)
Generate multiple mosaics
High-res print generation
Display attendees (MVP)
Comment on pictures / feed adjacent to mosaic
Post-processing on complete mosaic
  -grayscale
  -filters
  -dreamify???


## Team

  - __Product Owner__: Rob Hays
  - __Scrum Master__: Mack Levine
  - __Development Team Members__: Mark Robson, Jon Schapiro, Jimmy Williamson

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    a. [Installing Dependencies](#installing-dependencies)
    b. [Tasks](#tasks)
    c. [Docs Generator](#docs-generator)
4. [Team](#team)
5. [Contributing](#contributing)

## Usage



## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

### Docs Generator

JSDoc is used to generate the API documentation. This particular service was selected primarily for its source code-parsing ability. Unlike most of its competitors, JSDoc understands JavaScript in addition to comment blocks. As a result, documentation only comes into existence for a given method when it is commented properly AND actually built out in JavaScript.

Out of the box, JSDoc requires some customization to make it look nice; Docstrap is used to provide a high level of polish for the final documentation.


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.