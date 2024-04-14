/**
 * This function defines the algorythm for plotting city blocks maintaining the diamond shape.
 * The input is a sequential number of the block and the output are
 * the pair of cartesian coordinates to be later converted into isometric coordinates.
 *
 * @param {int} n positive integer representing the sequence number of the city block
 */
function getMapTileCoordinates(n) {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error("We can only draw blocks with positive integer numbers");
  }

  // primary coordinate
  const primary = Math.ceil(Math.sqrt(n));

  // secondary coordinate
  const secondary = Math.ceil((n - Math.pow(Math.floor(Math.sqrt(n)), 2)) / 2);

  if (secondary === 0) {
    // center line tile
    return { x: primary, y: primary };
  } else {
    // boolean representing the side of the diamond, e.g. left (false) or right (true)
    const direction =
      Math.ceil((n - Math.pow(Math.floor(Math.sqrt(n)), 2)) / 2) -
      Math.floor((n - Math.pow(Math.floor(Math.sqrt(n)), 2)) / 2) ===
      0;

    if (direction) {
      // append to the right
      return { x: secondary, y: primary };
    } else {
      // append to the left
      return { x: primary, y: secondary };
    }
  }
}

/**
 * Returns a tile number from a tileset based on the cluster of files
 * It currently uses total number of lines of code as a seed for the tile number
 *
 * @param {*} cluster an array of file objects tile represents
 * @param {*} numberOfTileVariations the number of tile variations in the tileset
 *
 * @returns {int} a 1-based number of the tile
 */
function getTileNumber(cluster, numberOfTileVariations) {
  let tileNumber = 0;

  try {
    const totalLinesInCluster = cluster.reduce(
      (acc, [file]) => acc + file.Lines,
      0
    );

    tileNumber = (totalLinesInCluster % numberOfTileVariations) + 1;
  } catch (error) {
    tileNumber = Math.floor(Math.random() * numberOfTileVariations) + 1;
  }

  return tileNumber;
}

export const generateMapHTML = function (gameConfig, clusters) {
  // scale the image if total is too high
  const tileScale = 1;

  // actual image dimensions
  const tileOriginalWidth = gameConfig.tileSet.tileOriginalWidth;
  const highestTileOriginalHeight =
    gameConfig.tileSet.highestTileOriginalHeight;
  const numberOfTileVariations = gameConfig.tileSet.numberOfTileVariations;

  // calculated dimensions based on scale
  const tileWidth = tileOriginalWidth * tileScale;
  const tileHeight = tileWidth / 2;
  const isometricSkew = 1.73;
  const highestTileHeight = highestTileOriginalHeight * tileScale;

  let lowestIsoX = 0;
  let highestIsoX = 0;
  let highestIsoY = 0;

  const tiles = [];

  // I count from last to first so first tiles get painted on top of the last tile in the final image.
  for (let i = clusters.length; i >= 1; i--) {
    const blockCoordinates = getMapTileCoordinates(i);

    const isoX =
      (blockCoordinates.x * tileWidth) / 2 - blockCoordinates.y * tileHeight;
    const isoY =
      ((blockCoordinates.x * tileWidth) / 2 + blockCoordinates.y * tileHeight) /
      isometricSkew;

    if (lowestIsoX > isoX) {
      lowestIsoX = isoX;
    }
    if (highestIsoX < isoX) {
      highestIsoX = isoX;
    }
    if (highestIsoY < isoY) {
      highestIsoY = isoY;
    }

    const tileNumber = getTileNumber(clusters[i - 1], numberOfTileVariations);

    tiles.push({ tileNumber, isoX, isoY });
  }

  const tileImages = tiles.map(
    (tile) =>
      `

    <use href="#tile${tile.tileNumber}" 
      style="transform: translate(
        ${tile.isoX + tile.isoY / 2}px,
        ${tile.isoY}px
      )"
    />

    `


  );

  const mapWidth = highestIsoX;
  const mapHeight = highestIsoY;
  let sprites = "";

  return `<!doctype html>
      <html>
        <head>
          <meta
            property="og:image"
            content="https://gitterra.com/images/background_and_menus/logobanner.svg"
          />
          <meta property="og:image:type" content="image/svg" />
          <link rel="icon" type="image/png" href="https://gitterra.com/images/logo.png" />
          <title>Your Repo Map | GitTerra</title>
          <style>
          h1,
          #feedback {
            text-align: center;
          }
          h1 * {
            vertical-align: middle;
          }
          body {
            /* webpackIgnore: true */
            background: url(https://gitterra.com/images/background_and_menus/site_background_image_bg.svg);
            background-size: cover;
          }
          #logobanner {
            aspect-ratio: auto 400 / 216.012;
            width: 30%;
            min-width: 10em;
            max-width: 15em;
          }

          .tileset {
            width: 0;
            height: 0;
          }

          </style>
          
        </head>
        <body>
          <h1>
            <a href="https://gitterra.com/" target="_blank">
              <img
                id="logobanner"
                src="https://gitterra.com/images/background_and_menus/logobanner.svg"
              />
            </a>
          </h1>
          <div id="feedback">
            <a href="https://gitlab.com/gitterra/GitTerra/-/issues/new" target="_blank">
              How can we make this game better?
            </a>
          </div>
          <svg viewBox="0 0 ${mapWidth} ${mapHeight}" width="80%">
            ${tileImages.join("")}
          </svg>
          <div class="tileset">
          ${sprites}

          <?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 2013 1774" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <rect id="novaterraprime_tile_1" x="0" y="0.983" width="2012.61" height="1772.16" style="fill:none;"/>
    <clipPath id="_clip1">
        <rect x="0" y="0.983" width="2012.61" height="1772.16"/>
    </clipPath>
    <g clip-path="url(#_clip1)">
        <g id="tile1">
            <g id="tilebase">
                <path d="M2006.11,1006.3l0,189.322l-1000.29,577.517l0,-189.322l1000.29,-577.517Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
                <path d="M1005.82,1582.86l0,189.799l-999.462,-577.039l0,-189.8l999.462,577.04Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
                <path d="M1006.65,428.973l999.711,577.183l-999.711,577.183l-999.711,-577.183l999.711,-577.183Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            </g>
            <path d="M1770.68,516.565l-0,543.321l-117.633,67.915l0,-543.32l117.633,-67.916Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1653.05,448.65l0,543.321l-117.632,67.915l0,-543.321l117.632,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1535.42,380.735l0,543.321l-117.632,67.915l-0,-543.321l117.632,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1417.79,312.82l-0,543.321l-117.633,67.915l0,-543.321l117.633,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1300.15,244.905l0,543.321l-117.632,67.915l-0,-543.321l117.632,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1182.52,176.99l-0,543.321l-117.633,67.915l0,-543.321l117.633,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1065.05,108.98l-0,543.321l-117.633,67.915l0,-543.321l117.633,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M947.257,41.16l-0,543.321l-117.633,67.915l0,-543.321l117.633,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M888.441,7.202l882.243,509.363l-117.633,67.916l-882.243,-509.364l117.633,-67.915Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1653.05,584.481l0,543.32l-58.816,-33.957l0,-458.908c0,-10.209 -5.446,-19.642 -14.288,-24.747c-0.001,-0.001 -0.001,-0.001 -0.002,-0.001c-9.184,-5.303 -20.5,-5.303 -29.684,-0c-9.184,5.302 -14.842,15.102 -14.842,25.707l0,423.991l-58.816,-33.957l-0,-458.908c-0,-10.209 -5.447,-19.643 -14.288,-24.747c-0.001,-0.001 -0.002,-0.001 -0.002,-0.001c-9.185,-5.303 -20.5,-5.303 -29.684,-0c-9.185,5.302 -14.842,15.102 -14.842,25.707l-0,423.991l-58.817,-33.957l0,-458.908c0,-10.209 -5.446,-19.643 -14.288,-24.747c-0,-0.001 -0.001,-0.001 -0.002,-0.002c-9.184,-5.302 -20.5,-5.302 -29.684,0c-9.184,5.303 -14.842,15.102 -14.842,25.707l0,423.992l-58.816,-33.957l-0,-458.908c-0,-10.209 -5.447,-19.643 -14.288,-24.747c-0.001,-0.001 -0.002,-0.001 -0.002,-0.002c-9.185,-5.302 -20.5,-5.302 -29.684,0c-9.185,5.303 -14.842,15.102 -14.842,25.707l-0,423.992l-58.816,-33.958l-0,-458.907c-0,-10.209 -5.447,-19.643 -14.289,-24.748c-0,0 -0.001,-0 -0.002,-0.001c-9.184,-5.302 -20.499,-5.302 -29.684,0c-9.184,5.303 -14.842,15.102 -14.842,25.707l0,423.992l-58.816,-33.958l0,-458.993c0,-10.156 -5.418,-19.541 -14.214,-24.619c-0,-0 -0.001,-0 -0.001,-0.001c-9.168,-5.293 -20.463,-5.294 -29.632,-0.002c-9.169,5.291 -14.819,15.071 -14.822,25.658c-0.043,122.9 -0.147,424 -0.147,424l-58.816,-33.958l-0,-458.907c-0,-10.209 -5.447,-19.643 -14.288,-24.748c-0.001,-0 -0.002,-0.001 -0.003,-0.001c-9.184,-5.303 -20.499,-5.303 -29.684,-0c-9.184,5.302 -14.842,15.102 -14.842,25.707l0,423.992l-58.816,-33.958l0,-543.321l882.243,509.364Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M594.524,720.216l117.633,-67.915l176.448,101.872l-117.632,67.915l-176.449,-101.872Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M888.605,754.173l0,67.915l-117.632,67.916l-0,-67.916l117.632,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M770.973,822.088l-0,67.916l-176.449,-101.873l0,-67.915l176.449,101.872Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M653.34,754.173l-117.632,135.831l117.632,-67.916l0,-67.915Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M653.34,754.173l-117.632,135.831l-58.816,-33.958l117.632,-135.83l58.816,33.957Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1006.4,1433.42l-353.062,-203.84l58.817,-33.957l117.632,67.915l176.613,-101.968l176.419,101.998l235.13,-135.861l58.816,33.958l-235.264,135.83l-235.101,135.925Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1006.4,1433.42l-0.164,67.821l-411.714,-237.703l58.816,-33.958l353.062,203.84Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1006.4,1501.14l529.182,-305.523l-58.817,-33.958l-470.365,271.755l0,67.726Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M359.259,923.961l117.633,67.915l-117.633,67.915l-117.632,-67.915l117.632,-67.915Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path d="M359.259,584.386l58.817,33.957l-58.817,33.958l-58.816,-33.958l58.816,-33.957Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path d="M369.505,984.934c0.109,0.593 0.165,1.203 0.165,1.826c0,5.652 -4.665,10.24 -10.411,10.24c-5.746,0 -10.411,-4.588 -10.411,-10.24c0,-0.623 0.057,-1.233 0.166,-1.826l-0,-177.039l20.491,-0l0,177.039Z" style="fill:#c06100;stroke:#000;stroke-width:12.5px;"/>
            <path d="M359.259,652.301l0,203.745l-58.816,-33.958l0,-203.745l58.816,33.958Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path d="M359.259,652.301l0,203.745l58.817,-33.958l-0,-203.745l-58.817,33.958Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <g transform="matrix(0.866025,0.5,-4.80741e-17,1,-2752.87,10273.9)">
                <g transform="matrix(155.283,0,0,155.283,4213.7,-10727)">
                </g>
                <text x="3316.28px" y="-10727px" style="font-family:'Arial-BoldMT', 'Arial', sans-serif;font-weight:700;font-size:155.283px;">gitterra.com</text>
            </g>
        </g>
    </g>
</svg>

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 2014 1774" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <rect id="novaterraprime_tile_2" x="0.765" y="0.983" width="2012.61" height="1772.16" style="fill:none;"/>
    <clipPath id="_clip1">
        <rect x="0.765" y="0.983" width="2012.61" height="1772.16"/>
    </clipPath>
    <g clip-path="url(#_clip1)">
        <g id="tile2">
            <g id="tilebase">
                <path d="M2010.5,1005l-0,189.322l-1000.29,577.517l-0,-189.321l1000.29,-577.518Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
                <path d="M1010.21,1581.56l-0,189.799l-999.463,-577.04l0,-189.799l999.463,577.04Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
                <path d="M1011.04,427.672l999.711,577.184l-999.711,577.183l-999.711,-577.183l999.711,-577.184Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            </g>
            <path id="primary-color-darker" d="M798.106,844.939l-0,95.2l164.891,-95.2l-82.445,-47.6l-82.446,47.6Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <path d="M798.106,940.139l-0,238l-371.005,-214.2l-0,-238l371.005,214.2Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M798.106,940.139l-0,238l164.891,-95.2l0,-238l-164.891,95.2Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color" d="M1251.56,678.339l41.223,-23.8l-0,-47.6l-453.451,-261.8c-0,-0 20.098,35.996 -41.223,71.4l453.451,261.8Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-darker1" serif:id="primary-color-darker" d="M1292.78,606.939c-0,-0 2.845,45.957 -41.223,71.4c-44.068,25.442 164.891,-95.2 164.891,-95.2c0,-0 -42.788,12.111 -41.223,-23.8l-82.445,47.6Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-lighter" d="M921.774,297.539l453.451,261.8l-82.445,47.6l-453.451,-261.8l82.445,-47.6Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1251.56,678.339l-0,238l-453.451,-261.8l-0,-238l453.451,261.8Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1416.45,821.139l-329.782,190.4l-0,-47.6l164.891,-95.2l-0,-190.4l164.891,-95.2l0,238Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M851.968,495.236c0,5.696 3.039,10.96 7.972,13.808l0,133.595l-20.611,-11.9l-0,-133.76c1.615,0.932 3.604,0.932 5.219,-0c1.615,-0.933 2.61,-2.656 2.61,-4.52c1.574,0.909 3.231,1.865 4.81,2.777Z"/>
            <path d="M893.191,519.036c0,5.696 3.039,10.96 7.972,13.808l-0,133.595l-20.611,-11.9l-0,-133.76c1.614,0.932 3.604,0.932 5.219,-0c1.615,-0.933 2.609,-2.656 2.609,-4.52c1.575,0.909 3.232,1.865 4.811,2.777Z"/>
            <path d="M934.414,542.836c-0,5.696 3.039,10.96 7.972,13.808l-0,133.595l-20.612,-11.9l0,-133.76c1.615,0.932 3.605,0.932 5.22,-0c1.614,-0.933 2.609,-2.656 2.609,-4.52c1.575,0.909 3.231,1.865 4.811,2.777Z"/>
            <path d="M975.637,566.636c-0,5.696 3.039,10.96 7.972,13.808l-0,133.595l-20.612,-11.9l0,-133.76c1.615,0.932 3.605,0.932 5.219,-0c1.615,-0.933 2.61,-2.656 2.61,-4.52c1.575,0.909 3.231,1.865 4.811,2.777Z"/>
            <path d="M1016.86,590.436c0,5.696 3.039,10.96 7.972,13.808l0,133.595l-20.611,-11.9l0,-133.76c1.615,0.932 3.604,0.932 5.219,-0c1.615,-0.933 2.61,-2.656 2.61,-4.52c1.574,0.909 3.231,1.865 4.81,2.777Z"/>
            <path d="M1058.08,614.236c0,5.696 3.039,10.96 7.972,13.808l0,133.595l-20.611,-11.9l-0,-133.76c1.615,0.932 3.604,0.932 5.219,-0c1.615,-0.933 2.61,-2.656 2.61,-4.52c1.574,0.909 3.231,1.865 4.81,2.777Z"/>
            <path d="M1099.31,638.036c0,5.696 3.039,10.96 7.972,13.808l0,133.595l-20.611,-11.9l-0,-133.76c1.614,0.932 3.604,0.932 5.219,-0c1.615,-0.933 2.609,-2.656 2.609,-4.52c1.575,0.909 3.232,1.865 4.811,2.777Z"/>
            <path d="M1140.53,661.836c-0,5.696 3.039,10.96 7.972,13.808l-0,133.595l-20.612,-11.9l0,-133.76c1.615,0.932 3.605,0.932 5.22,-0c1.614,-0.933 2.609,-2.656 2.609,-4.52c1.575,0.909 3.231,1.865 4.811,2.777Z"/>
            <path d="M1181.75,685.636c-0,5.696 3.039,10.96 7.972,13.808l-0,133.595l-20.612,-11.9l0,-133.76c1.615,0.932 3.605,0.932 5.219,-0c1.615,-0.933 2.61,-2.656 2.61,-4.52c1.575,0.909 3.231,1.865 4.811,2.777Z"/>
            <path d="M1300.75,697.536c-0,5.696 -3.039,10.96 -7.972,13.808l-0,133.595l20.611,-11.9l0,-133.76c-1.615,0.932 -3.604,0.932 -5.219,-0c-1.615,-0.933 -2.61,-2.656 -2.61,-4.52c-1.574,0.909 -3.231,1.865 -4.81,2.777Z"/>
            <path d="M1383.2,649.936c0,5.696 -3.039,10.96 -7.972,13.808l0,133.595l20.612,-11.9l-0,-133.76c-1.615,0.932 -3.605,0.932 -5.22,-0c-1.614,-0.933 -2.609,-2.656 -2.609,-4.52c-1.575,0.909 -3.231,1.865 -4.811,2.777Z"/>
            <path d="M1341.97,721.336c0,5.696 -3.038,10.96 -7.972,13.808l0,133.595l20.612,-11.9l-0,-133.76c-1.615,0.932 -3.604,0.932 -5.219,-0c-1.615,-0.933 -2.61,-2.656 -2.61,-4.52c-1.575,0.909 -3.231,1.865 -4.811,2.777Z"/>
            <path d="M427.101,963.939l-0,142.8l-123.669,-71.4l0,-142.8l123.669,71.4Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M880.552,1225.74l-0,142.8l-123.669,-71.4l0,-142.8l123.669,71.4Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M427.101,963.939l-0,142.8l123.668,-71.4l0,-142.8l-123.668,71.4Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M880.552,1225.74l-0,142.8l247.336,-142.8l0,-142.8l-247.336,142.8Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-lighter1" serif:id="primary-color-lighter" d="M427.101,821.139l82.445,47.6l-82.445,47.6l-82.446,-47.6l82.446,-47.6Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-lighter2" serif:id="primary-color-lighter" d="M1004.22,1011.54l82.446,47.6l-206.114,119l-82.446,-47.6l206.114,-119Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color1" serif:id="primary-color" d="M427.101,916.339l-0,47.6l-123.669,-71.4l41.223,-23.8l82.446,47.6Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color2" serif:id="primary-color" d="M880.552,1178.14l-0,47.6l-123.669,-71.4l41.223,-23.8l82.446,47.6Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-darker2" serif:id="primary-color-darker" d="M427.101,916.339l-0,47.6l123.668,-71.4l-41.223,-23.8l-82.445,47.6Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-darker3" serif:id="primary-color-darker" d="M880.552,1178.14l-0,47.6l247.336,-142.8l-41.222,-23.8l-206.114,119Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <path d="M348.411,966.107c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.612,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.258,-1.303 5.039,-1.303 7.296,0c1.064,0.614 2.118,1.223 3.118,1.8Z"/>
            <path d="M801.862,1227.91c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.612,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.258,-1.303 5.039,-1.303 7.296,0c1.064,0.614 2.118,1.223 3.118,1.8Z"/>
            <path d="M389.634,989.907c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.612,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.258,-1.303 5.039,-1.303 7.296,0c1.064,0.614 2.118,1.223 3.118,1.8Z"/>
            <path d="M843.084,1251.71c4.054,2.34 6.55,6.665 6.55,11.345c0,13.429 0,40.037 0,40.037l-20.611,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.257,-1.303 5.039,-1.303 7.296,0c1.063,0.614 2.118,1.223 3.117,1.8Z"/>
            <path d="M744.333,1004.29c7.766,4.484 12.55,12.77 12.55,21.737c0,36.313 0,128.309 0,128.309l-41.223,-23.8c0,-0 0,-89.648 0,-126.883c0,-3.283 1.752,-6.317 4.595,-7.959c2.844,-1.641 6.347,-1.641 9.19,0c4.812,2.778 10.183,5.879 14.888,8.596Z"/>
            <path d="M845.879,960.157c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,29.503 -0,135.237 -0,135.237l20.611,-11.9c0,-0 0,-95.244 0,-130.163c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.118,1.223 -3.117,1.8Z"/>
            <path d="M907.713,924.457c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,29.503 -0,135.237 -0,135.237l20.611,-11.9c0,-0 0,-95.244 0,-130.163c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.117,1.223 -3.117,1.8Z"/>
            <path d="M688.499,924.457c4.053,2.34 6.55,6.665 6.55,11.345c-0,29.503 -0,135.237 -0,135.237l-20.611,-11.9c-0,-0 -0,-95.244 -0,-130.163c-0,-2.607 1.39,-5.016 3.648,-6.319c2.257,-1.303 5.038,-1.303 7.296,0c1.063,0.614 2.117,1.223 3.117,1.8Z"/>
            <path d="M647.276,900.657c4.053,2.34 6.55,6.665 6.55,11.345c0,29.503 0,135.237 0,135.237l-20.611,-11.9c-0,-0 -0,-95.244 -0,-130.163c-0,-2.607 1.39,-5.016 3.648,-6.319c2.257,-1.303 5.038,-1.303 7.296,0c1.063,0.614 2.117,1.223 3.117,1.8Z"/>
            <path d="M606.053,876.857c4.053,2.34 6.55,6.665 6.55,11.345c0,29.503 0,135.237 0,135.237l-20.611,-11.9c-0,-0 -0,-95.244 -0,-130.163c-0,-2.607 1.391,-5.016 3.648,-6.319c2.257,-1.303 5.039,-1.303 7.296,0c1.063,0.614 2.118,1.223 3.117,1.8Z"/>
            <path d="M464.568,989.907c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.118,1.223 -3.117,1.8Z"/>
            <path d="M1041.69,1180.31c-4.053,2.34 -6.55,6.665 -6.55,11.345c0,13.429 0,40.037 0,40.037l20.612,-11.9l-0,-34.963c-0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.258,-1.303 -5.039,-1.303 -7.296,0c-1.064,0.614 -2.118,1.223 -3.118,1.8Z"/>
            <path d="M1000.46,1204.11c-4.053,2.34 -6.55,6.665 -6.55,11.345c0,13.429 0,40.037 0,40.037l20.612,-11.9l-0,-34.963c-0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.258,-1.303 -5.039,-1.303 -7.296,0c-1.064,0.614 -2.118,1.223 -3.118,1.8Z"/>
            <path d="M959.242,1227.91c-4.054,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l-0,-34.963c-0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.257,-1.303 -5.039,-1.303 -7.296,0c-1.063,0.614 -2.118,1.223 -3.117,1.8Z"/>
            <path d="M918.019,1251.71c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.257,-1.303 -5.039,-1.303 -7.296,0c-1.063,0.614 -2.118,1.223 -3.117,1.8Z"/>
            <path d="M505.791,966.107c-4.054,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.257,-1.303 -5.039,-1.303 -7.296,0c-1.063,0.614 -2.118,1.223 -3.117,1.8Z"/>
            <path d="M1082.91,1156.51c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.117,1.223 -3.117,1.8Z"/>
            <path id="primary-color-lighter3" serif:id="primary-color-lighter" d="M591.992,630.739l288.56,166.6l-82.446,47.6l-288.56,-166.6l82.446,-47.6Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color3" serif:id="primary-color" d="M798.106,844.939l-0,95.2l-371.005,-214.2l82.445,-47.6l288.56,166.6Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path d="M550.769,830.659c6.826,3.94 12.367,13.538 12.367,21.42c-0,7.881 -5.541,11.08 -12.367,7.14c-6.825,-3.941 -12.367,-13.539 -12.367,-21.42c0,-7.882 5.542,-11.081 12.367,-7.14Z"/>
            <path d="M509.546,805.065c6.826,3.941 12.367,13.539 12.367,21.42c0,7.881 -5.541,11.081 -12.367,7.14c-6.825,-3.941 -12.367,-13.539 -12.367,-21.42c0,-7.881 5.542,-11.081 12.367,-7.14Z"/>
            <path d="M468.323,783.059c6.826,3.94 12.367,13.538 12.367,21.42c0,7.881 -5.541,11.08 -12.367,7.14c-6.825,-3.941 -12.366,-13.539 -12.366,-21.42c-0,-7.882 5.541,-11.081 12.366,-7.14Z"/>
            <path d="M1210.33,1273.34l0,142.8l-123.668,-71.4l-0,-142.8l123.668,71.4Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1210.33,1273.34l0,142.8l123.668,-71.4l0,-142.8l-123.668,71.4Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color4" serif:id="primary-color" d="M1210.33,1225.74l0,47.6l-123.668,-71.4l41.222,-23.8l82.446,47.6Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1131.64,1275.51c4.053,2.34 6.55,6.665 6.55,11.345c0,13.429 0,40.037 0,40.037l-20.611,-11.9l-0,-34.963c-0,-2.607 1.39,-5.016 3.648,-6.319c2.257,-1.303 5.038,-1.303 7.296,0c1.063,0.614 2.117,1.223 3.117,1.8Z"/>
            <path d="M1172.87,1299.31c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.611,-11.9l-0,-34.963c-0,-2.607 1.39,-5.016 3.648,-6.319c2.257,-1.303 5.038,-1.303 7.296,0c1.063,0.614 2.117,1.223 3.117,1.8Z"/>
            <path d="M1247.8,1299.31c-4.053,2.34 -6.55,6.665 -6.55,11.345c0,13.429 0,40.037 0,40.037l20.612,-11.9l-0,-34.963c-0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.258,-1.303 -5.039,-1.303 -7.296,0c-1.064,0.614 -2.118,1.223 -3.118,1.8Z"/>
            <path d="M1289.02,1275.51c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.117,1.223 -3.117,1.8Z"/>
            <path id="primary-color-lighter4" serif:id="primary-color-lighter" d="M1210.33,1130.54l82.446,47.6l-82.446,47.6l-82.446,-47.6l82.446,-47.6Z" style="fill:#62b54a;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-darker4" serif:id="primary-color-darker" d="M1210.33,1225.74l0,47.6l123.668,-71.4l-41.222,-23.8l-82.446,47.6Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1663.79,1059.14l-0,95.2l-288.56,-166.6l0,-95.2l288.56,166.6Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1391.71,1149.61c2.471,10.116 -3.026,20.758 -16.489,28.531c-22.751,13.135 -59.694,13.135 -82.445,-0c-11.521,-6.652 -17.208,-15.405 -17.061,-24.13l-0,-47.27l115.995,-0l0,42.869Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1292.78,1082.94c22.751,-13.136 59.694,-13.136 82.445,-0c22.752,13.135 22.752,34.464 0,47.6c-22.751,13.135 -59.694,13.135 -82.445,-0c-22.752,-13.136 -22.752,-34.465 -0,-47.6Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1309.27,1092.46c13.651,-7.882 35.816,-7.882 49.467,-0c13.651,7.881 13.651,20.678 0,28.56c-13.651,7.881 -35.816,7.881 -49.467,-0c-13.651,-7.882 -13.651,-20.679 -0,-28.56Z"/>
            <path d="M1461.43,966.107c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.612,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.258,-1.303 5.039,-1.303 7.296,0c1.064,0.614 2.118,1.223 3.118,1.8Z"/>
            <path d="M1420.2,942.307c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.612,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.258,-1.303 5.039,-1.303 7.296,0c1.064,0.614 2.118,1.223 3.118,1.8Z"/>
            <path d="M1787.45,987.739l0,95.2l-206.114,119l0,-95.2l206.114,-119Z" style="fill:#808184;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1498.89,963.939l-123.669,-71.4l123.669,-71.4l288.559,166.6l-206.114,119l-164.891,-95.2l82.446,-47.6Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1581.34,1106.74l0,95.2l-164.891,-95.2l0,-95.2l164.891,95.2Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color5" serif:id="primary-color" d="M1581.34,1059.14l-82.445,-47.6l41.223,-119l41.222,166.6Z" style="fill:#4e913b;stroke:#000;stroke-width:12.5px;"/>
            <path id="primary-color-darker5" serif:id="primary-color-darker" d="M1581.34,1059.14l123.669,-71.4l-41.223,-166.6l-123.668,71.4l41.222,166.6Z" style="fill:#3b6d2c;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1618.81,1108.91c-4.053,2.34 -6.55,6.665 -6.55,11.345c0,13.429 0,40.037 0,40.037l20.612,-11.9l-0,-34.963c-0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.258,-1.303 -5.039,-1.303 -7.296,0c-1.064,0.614 -2.118,1.223 -3.118,1.8Z"/>
            <path d="M1660.03,1085.11c-4.053,2.34 -6.55,6.665 -6.55,11.345c0,13.429 0,40.037 0,40.037l20.612,-11.9l-0,-34.963c-0,-2.607 -1.391,-5.016 -3.648,-6.319c-2.258,-1.303 -5.039,-1.303 -7.296,0c-1.064,0.614 -2.118,1.223 -3.118,1.8Z"/>
            <path d="M1701.25,1061.31c-4.053,2.34 -6.55,6.665 -6.55,11.345c0,13.429 0,40.037 0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.117,1.223 -3.117,1.8Z"/>
            <path d="M1543.87,1108.91c4.053,2.34 6.55,6.665 6.55,11.345c0,13.429 0,40.037 0,40.037l-20.611,-11.9l-0,-34.963c-0,-2.607 1.39,-5.016 3.648,-6.319c2.257,-1.303 5.038,-1.303 7.296,0c1.063,0.614 2.118,1.223 3.117,1.8Z"/>
            <path d="M1502.65,1085.11c4.054,2.34 6.55,6.665 6.55,11.345c0,13.429 0,40.037 0,40.037l-20.611,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.257,-1.303 5.039,-1.303 7.296,0c1.063,0.614 2.118,1.223 3.117,1.8Z"/>
            <path d="M1461.43,1061.31c4.053,2.34 6.55,6.665 6.55,11.345c-0,13.429 -0,40.037 -0,40.037l-20.612,-11.9l0,-34.963c0,-2.607 1.391,-5.016 3.648,-6.319c2.258,-1.303 5.039,-1.303 7.296,0c1.064,0.614 2.118,1.223 3.118,1.8Z"/>
            <path d="M1742.48,1037.51c-4.053,2.34 -6.55,6.665 -6.55,11.345c-0,13.429 -0,40.037 -0,40.037l20.611,-11.9l0,-34.963c0,-2.607 -1.39,-5.016 -3.648,-6.319c-2.257,-1.303 -5.038,-1.303 -7.296,0c-1.063,0.614 -2.117,1.223 -3.117,1.8Z"/>
            <path d="M1086.67,963.939l-0,47.6l-41.223,-23.8l-0,-47.6l41.223,23.8Z" style="fill:#a6a8ab;stroke:#000;stroke-width:12.5px;"/>
            <path d="M1210.33,844.939l41.223,23.8l-164.891,95.2l-41.223,-23.8l164.891,-95.2Z" style="fill:#d0d2d3;stroke:#000;stroke-width:12.5px;"/>
            <g transform="matrix(0.866025,0.5,-4.80741e-17,1,-2753.22,10275.1)">
                <g transform="matrix(155.283,0,0,155.283,4211.15,-10732.3)">
                </g>
                <text x="3313.72px" y="-10732.3px" style="font-family:'Arial-BoldMT', 'Arial', sans-serif;font-weight:700;font-size:155.283px;">gitterra.com</text>
            </g>
        </g>
    </g>
</svg>


          </div>
        </body>
      </html>
      `;
};

