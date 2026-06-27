'use strict';
(() => {
  const ALBUM_LINK_DEFAULT = 'https://witness6.bandcamp.com/album/lifecycles?referer=Albumized!';
  const SCALE = 30;
  const JSON_SOURCE = 'https://rottina.com/8fac666a0a596d41fe05ef3d83eca175.json';
  const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';
  const localeCountryMap = {
    ar: 'sa', am: 'bf', bg: 'bg', bn: 'in', ca: 'es', cs: 'cz', da: 'dk', de: 'de', el: 'gr', en: 'us',
    en_GB: 'gb', en_US: 'us', es: 'es', es_419: 'mx', et: 'ee', fa: 'us', fi: 'fi', fil: 'ph', fr: 'fr',
    he: 'il', hi: 'in', hr: 'hr', hu: 'hu', id: 'id', it: 'it', ja: 'jp', kn: 'in', ko: 'kr', lt: 'lt',
    lv: 'lv', ml: 'in', mr: 'in', ms: 'my', nl: 'nl', no: 'no', pl: 'pl', pt_BR: 'br', pt_PT: 'pt', ro: 'ro',
    ru: 'ru', sk: 'sk', sl: 'si', sr: 'si', sv: 'se', sw: 'tz', ta: 'in', te: 'in', th: 'th', tr: 'tr',
    uk: 'ua', vi: 'vn', zh_CN: 'cn', zh_TW: 'tw'
  };

  const holidaySearchTerms = new Map([
    [16, ['love', 'valentine', 'cupid', 'love+stinks', 'arrow+heart', 'chocolate', 'hearts', 'heart', 'dozen+roses']],
    [1, ['2018', 'new+years+day']],
    [37, ['reindeer', 'celebrate+me+home', 'white+christmas', 'christmas', 'most+wonderful+time+of+the+year', 'christmas+tree', 'silent+night', 'merry+christmas', 'santa+claus', 'white+christmas', 'christmas', 'most+wonderful+time+of+the+year', 'christmas+tree', 'silent+night', 'merry+christmas']],
    [42, ['michael+myers', 'poltergeist', 'halloween', 'trick+or+treat', 'monster+mash', 'thriller', 'candy', 'thriller', 'ghoul']]
  ]);

  const holidayCodes = {
    '1-1': 2,
    '2-14': 16,
    '10-31': 41,
    '11-27': 38,
    '12-24': 36,
    '12-25': 37
  };

  const albumImages = Array.from({ length: 16 }, (_, index) => document.getElementById(`album${index + 1}`));
  const imgFro = document.getElementById('fro');
  const albumLinks = new Map();
  for (let i = 1001; i <= 1016; i += 1) {
    albumLinks.set(i, ALBUM_LINK_DEFAULT);
  }

  const state = {
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    bgColor: '#101019',
    ballColor: '#1A2433',
    density: 1.0,
    friction: 0.3,
    restitution: 0.3,
    gravity: 9,
    ballTotal: 18,
    sheepMode: false,
    destroyList: [],
    shapes: {},
    needToDraw: false,
    debug: false,
    gravityDirection: 0,
    blankTabConfirmed: false,
    domLoaded: false,
    started: false
  };

  let world = null;
  let fixDef = null;
  let canvas = null;
  let ctx = null;
  let selectedBody = null;
  let mouseX = 0;
  let mouseY = 0;

  const b2Vec2 = Box2D.Common.Math.b2Vec2;
  const b2BodyDef = Box2D.Dynamics.b2BodyDef;
  const b2Body = Box2D.Dynamics.b2Body;
  const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  const b2World = Box2D.Dynamics.b2World;
  const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  const b2AABB = Box2D.Collision.b2AABB;

  class Shape {
    constructor(options = {}) {
      const randomX = ((Math.random() * (state.screenWidth - 300)) + 300) / SCALE;
      this.id = Math.round(Math.random() * 1_000_000);
      this.x = options.x ?? randomX - 3;
      this.y = options.y ?? (Math.random() * 30 - 40);
      this.angle = 0;
      this.color = options.color || state.ballColor;
      this.center = { x: null, y: null };
      this.isStatic = Boolean(options.isStatic);
      this.label = options.label ?? null;
    }

    update({ x, y, angle, center }) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.center = center;
    }
  }

  class Circle extends Shape {
    constructor(options = {}) {
      super(options);
      this.radius = options.radius || 1;
    }

    draw() {
      const px = this.x * SCALE;
      const py = this.y * SCALE;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * SCALE, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = state.bgColor;
      ctx.stroke();
      ctx.restore();
    }
  }

  class Box extends Shape {
    constructor(options = {}) {
      super(options);
      this.width = options.width || 4.2;
      this.height = options.height || 4.2;
      this.imgSrc = options.imgSrc;
    }

    draw() {
      const px = this.x * SCALE;
      const py = this.y * SCALE;
      const halfWidth = (this.width * SCALE) / 2;
      const halfHeight = (this.height * SCALE) / 2;
      const image = getBoxImage(this.imgSrc);

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.fillRect(-halfWidth, -halfHeight, this.width * SCALE, this.height * SCALE);

      if (image) {
        ctx.drawImage(image, -halfWidth, -halfHeight, this.width * SCALE, this.height * SCALE);
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = state.bgColor;
      ctx.strokeRect(-halfWidth, -halfHeight, this.width * SCALE, this.height * SCALE);
      ctx.restore();
    }
  }

  const getBoxImage = (imgSrc) => {
    if (imgSrc >= 1001 && imgSrc <= 1016) {
      return albumImages[imgSrc - 1001];
    }
    if (imgSrc !== 999) {
      return imgFro;
    }
    return null;
  };

  const getLocalizedLink = (url) => {
    try {
      const locale = chrome.i18n.getUILanguage() || 'en-US';
      const country = localeCountryMap[locale] || 'us';
      const parsed = new URL(url);
      const segments = parsed.pathname.split('/');
      if (segments.length > 1) {
        segments[1] = country;
        parsed.pathname = segments.join('/');
      }
      parsed.searchParams.set('itscg', '30200');
      parsed.searchParams.set('itsct', 'music_box_link');
      parsed.searchParams.set('ls', '1');
      parsed.searchParams.set('app', 'music');
      parsed.searchParams.set('mttnsubad', '1667990774');
      parsed.searchParams.set('at', '11l6841');
      return parsed.toString();
    } catch (error) {
      return url;
    }
  };

  const getCurrentHolidayCode = () => {
    const now = new Date();
    return holidayCodes[`${now.getMonth() + 1}-${now.getDate()}`] || 0;
  };

  const loadPreferences = () => {
    state.bgColor = localStorage.albumized_pref_bgcolor ? `#${localStorage.albumized_pref_bgcolor}` : '#101019';
    state.ballColor = localStorage.albumized_pref_ballcolor ? `#${localStorage.albumized_pref_ballcolor}` : '#1A2433';
    state.density = parseFloat(localStorage.albumized_pref_density) || 1.0;
    state.friction = parseFloat(localStorage.albumized_pref_friction) || 0.3;
    state.restitution = parseFloat(localStorage.albumized_pref_restitution) || 0.3;
    state.gravity = parseInt(localStorage.albumized_pref_gravity, 10) || 9;
    state.ballTotal = parseInt(localStorage.albumized_pref_balltotal, 10) || 18;
    state.sheepMode = localStorage.albumized_pref_sheep === 'true';

    if (state.sheepMode) {
      document.querySelector('header')?.classList.add('sheep');
      document.querySelector('header')?.setAttribute('title', 'Kabob!');
    }
  };

  const updateCanvasDimensions = () => {
    state.screenWidth = window.innerWidth;
    state.screenHeight = window.innerHeight;
    canvas.width = state.screenWidth * state.pixelRatio;
    canvas.height = state.screenHeight * state.pixelRatio;
    canvas.style.width = `${state.screenWidth}px`;
    canvas.style.height = `${state.screenHeight}px`;
    ctx.setTransform(state.pixelRatio, 0, 0, state.pixelRatio, 0, 0);
  };

  const destroyBody = (body) => {
    const userData = body.GetUserData();
    if (userData) {
      delete state.shapes[userData];
    }
    world.DestroyBody(body);
  };

  const removeBoundsOnResize = () => {
    const bodiesToDestroy = [];
    for (let body = world.GetBodyList(); body; body = body.GetNext()) {
      if (body.BoxNumber === 'ground' || body.BoxNumber === 'right') {
        bodiesToDestroy.push(body);
      }
    }
    bodiesToDestroy.forEach(destroyBody);
  };

  const setupSceneBounds = () => {
    add.box({
      label: 'leftWall',
      x: 0.5,
      y: 10000 / SCALE / 2,
      height: 10000 / SCALE,
      width: 1,
      color: state.bgColor,
      imgSrc: 999,
      isStatic: true
    });
    add.box({
      label: 'ground',
      x: state.screenWidth / SCALE / 2,
      y: state.screenHeight / SCALE + 49,
      width: state.screenWidth / SCALE,
      height: 98.5,
      color: state.bgColor,
      imgSrc: 999,
      isStatic: true
    });
    add.box({
      label: 'right',
      x: state.screenWidth / SCALE + 49,
      y: 10000 / SCALE / 2,
      width: 100,
      height: 10000 / SCALE,
      color: state.bgColor,
      imgSrc: 999,
      isStatic: true
    });
  };

  const setAnchorLinksToOptions = () => {
    const optionsUrl = chrome.runtime.getURL('options.html');
    document.querySelectorAll('a').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.assign(optionsUrl);
      });
    });
  };

  const getSearchTerms = async (holidayCode) => {
    if (holidaySearchTerms.has(holidayCode)) {
      return holidaySearchTerms.get(holidayCode);
    }

    try {
      const response = await fetch(JSON_SOURCE);
      if (!response.ok) {
        throw new Error('Failed to load search terms');
      }
      const json = await response.json();
      return Array.isArray(json) ? json : ['100', '1000', '200', '2129', '300', '400', '500', '600', '700', '800', '901', 'M', 'I', 'K', 'E', 'W', 'U', 'Z', 'H', 'E', 'R', 'E'];
    } catch (error) {
      return ['100', '1000', '200', '2129', '300', '400', '500', '600', '700', '800', '901', 'M', 'I', 'K', 'E', 'W', 'U', 'Z', 'H', 'E', 'R', 'E'];
    }
  };

  const itunesLookup = async (holidayCode) => {
    const searchTerms = await getSearchTerms(holidayCode);
    //const randomTermRaw = "smokey";
    const randomTermRaw = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const searchTerm = randomTermRaw.replace(/\+/g, ' ');
    const searchUrl = `${ITUNES_SEARCH_URL}?${new URLSearchParams({
      media: 'music',
      entity: 'song',
      attribute: 'songTerm',
      limit: '16',
      term: searchTerm
    })}`;

    new Typed('h3', {
      strings: [searchTerm],
      cursorChar: '|',
      startDelay: 808,
      typeSpeed: 7
    });

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error('iTunes search failed');
      }
      const data = await response.json();
      const regex = /100x100/;
      data.results?.forEach((song, index) => {
        if (index >= 16) {
          return;
        }
        const coverUrl = song.artworkUrl100?.replace(regex, '294x294');
        if (coverUrl && albumImages[index]) {
          albumImages[index].src = coverUrl;
          albumLinks.set(1001 + index, getLocalizedLink(song.collectionViewUrl));
        }
      });
    } catch (error) {
      console.warn('iTunes lookup failed', error);
    }
  };

  const add = {
    random(options = {}) {
      const radius = 0.5 + Math.random();
      this.circle({ ...options, radius });
    },
    circle(options = {}) {
      const shape = new Circle(options);
      state.shapes[shape.id] = shape;
      box2d.addToWorld(shape);
    },
    box(options = {}) {
      const width = options.width ?? ((Math.random() * 2) + 1.5);
      const height = options.height ?? width;
      const shape = new Box({ ...options, width, height });
      state.shapes[shape.id] = shape;
      box2d.addToWorld(shape);
    }
  };

  const box2d = {
    addToWorld(shape) {
      const bodyDef = this.create.bodyDef(shape);
      const body = this.create.body(bodyDef);
      if (shape.radius) {
        this.create.fixtures.circle(body, shape);
      } else {
        this.create.fixtures.box(body, shape);
      }
    },
    create: {
      world() {
        world = new b2World(new b2Vec2(0, state.gravity), false);
      },
      defaultFixture() {
        fixDef = new b2FixtureDef();
        fixDef.density = state.density;
        fixDef.friction = state.friction;
        fixDef.restitution = state.restitution;
      },
      bodyDef(shape) {
        const bodyDef = new b2BodyDef();
        bodyDef.type = shape.isStatic ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
        bodyDef.position.x = shape.x;
        bodyDef.position.y = shape.y;
        bodyDef.userData = shape.id;
        bodyDef.angle = shape.angle;
        return bodyDef;
      },
      body(bodyDef) {
        return world.CreateBody(bodyDef);
      },
      fixtures: {
        circle(body, shape) {
          fixDef.shape = new b2CircleShape(shape.radius);
          body.BoxNumber = shape.label ?? shape.id;
          body.CreateFixture(fixDef);
        },
        box(body, shape) {
          fixDef.shape = new b2PolygonShape();
          fixDef.shape.SetAsBox(shape.width / 2, shape.height / 2);
          body.BoxNumber = shape.label ?? shape.id;
          body.CreateFixture(fixDef);
        }
      }
    },
    get: {
      bodySpec(body) {
        return {
          x: body.GetPosition().x,
          y: body.GetPosition().y,
          angle: body.GetAngle(),
          center: {
            x: body.GetWorldCenter().x,
            y: body.GetWorldCenter().y
          }
        };
      }
    }
  };

  const loop = {
    step() {
      world.Step(1 / 60, 10, 10);
      world.ClearForces();
    },
    update() {
      state.destroyList.forEach(destroyBody);
      state.destroyList.length = 0;

      for (let body = world.GetBodyList(); body; body = body.m_next) {
        const userData = body.GetUserData();
        if (body.IsActive() && userData != null && state.shapes[userData]) {
          state.shapes[userData].update(box2d.get.bodySpec(body));
        }
      }

      state.needToDraw = true;
    },
    draw() {
      if (!state.needToDraw) {
        return;
      }
      if (!state.debug) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      Object.values(state.shapes).forEach((shape) => shape.draw(ctx));
      state.needToDraw = false;
    }
  };

  const getMouseCoords = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / SCALE,
      y: (event.clientY - rect.top) / SCALE
    };
  };

  const getBodyAtMouse = () => {
    const mousePVec = new b2Vec2(mouseX, mouseY);
    const aabb = new b2AABB();
    aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
    aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

    selectedBody = null;
    world.QueryAABB((fixture) => {
      const body = fixture.GetBody();
      if (body.GetType() !== b2Body.b2_staticBody && fixture.GetShape().TestPoint(body.GetTransform(), mousePVec)) {
        selectedBody = body;
        return false;
      }
      return true;
    }, aabb);

    return selectedBody;
  };

  const handleBodyClick = () => {
    if (!selectedBody) {
      return;
    }

    const bodyLabel = selectedBody.BoxNumber;
    const albumUrl = albumLinks.get(bodyLabel);

    if (albumUrl) {
      window.open(albumUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const impulseVectors = {
      0: { x: 0, y: -300 },
      1: { x: 0, y: -300 },
      2: { x: 300, y: 0 },
      3: { x: 0, y: 300 },
      4: { x: -300, y: 0 }
    };

    if (state.gravityDirection === 0) {
      add.box({
        label: 'roof',
        x: 4000 / SCALE / 2,
        y: 0.5,
        height: 1,
        width: 4000 / SCALE,
        color: state.bgColor,
        imgSrc: 999,
        isStatic: true
      });
      state.gravityDirection = 1;
    }

    const impulse = impulseVectors[state.gravityDirection] ?? impulseVectors[1];
    selectedBody.ApplyImpulse(impulse, selectedBody.GetWorldCenter());
  };

  const handleCanvasMouseDown = (event) => {
    const coords = getMouseCoords(event);
    mouseX = coords.x;
    mouseY = coords.y;
    canvas.addEventListener('mousemove', handleCanvasMouseMove, true);
    getBodyAtMouse();
    handleBodyClick();
  };

  const handleCanvasMouseMove = (event) => {
    const coords = getMouseCoords(event);
    mouseX = coords.x;
    mouseY = coords.y;
  };

  const handleMouseUp = () => {
    canvas.removeEventListener('mousemove', handleCanvasMouseMove, true);
    mouseX = 0;
    mouseY = 0;
  };

  const initializeVisuals = () => {
    document.body.style.transition = 'background 0.2s ease';
    canvas.style.transition = 'background 0.2s ease';
    document.body.style.background = state.bgColor;
    canvas.style.background = state.bgColor;

    const konami = new Konami();
    konami.code = () => {
      canvas.style.background = 'transparent url(/img/mattyice.jpg) repeat';
    };
    konami.load();
  };

  const addAlbumBoxes = () => {
    const albumSizes = [
      { width: 4.98, height: 4.98 }, { width: 4.17, height: 4.17 }, { width: 4.39, height: 4.39 },
      { width: 3.77, height: 3.77 }, { width: 4.72, height: 4.72 }, { width: 4.91, height: 4.91 },
      { width: 5.88, height: 5.88 }, { width: 5.37, height: 5.37 }, { width: 4.88, height: 4.88 },
      { width: 6.0, height: 6.0 }, { width: 5.28, height: 5.28 }, { width: 5.02, height: 5.02 },
      { width: 4.44, height: 4.44 }, { width: 4.2, height: 4.2 }, { width: 4.72, height: 4.72 },
      { width: 3.69, height: 3.69 }
    ];

    albumSizes.forEach((size, index) => {
      const boxNumber = 1001 + index;
      add.box({ ...size, imgSrc: boxNumber, label: boxNumber });
    });

    add.box({ width: 1.4, height: 1.6, imgSrc: 1017, label: 1017 });
  };

  const startLoop = () => {
    const animate = () => {
      loop.step();
      loop.update();
      loop.draw();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  const initScene = async () => {
    loadPreferences();
    canvas = document.getElementById('canvas-body');
    ctx = canvas.getContext('2d');
    updateCanvasDimensions();
    setAnchorLinksToOptions();
    box2d.create.world();
    box2d.create.defaultFixture();
    setupSceneBounds();
    initializeVisuals();
    canvas.addEventListener('mousedown', handleCanvasMouseDown, true);

    const count = state.screenWidth < 600 ? 5 : state.ballTotal;
    for (let i = 0; i < count; i += 1) {
      add.random({ label: i });
    }

    addAlbumBoxes();
    startLoop();
  };

  const handleResize = () => {
    updateCanvasDimensions();
    removeBoundsOnResize();
    setupSceneBounds();
  };

  const tryStartApp = async () => {
    if (state.started || !state.blankTabConfirmed || !state.domLoaded) {
      return;
    }
    state.started = true;
    const holidayCode = getCurrentHolidayCode();
    await itunesLookup(holidayCode);
    await initScene();
  };

  window.addEventListener('load', () => {
    state.domLoaded = true;
    tryStartApp();
  });

  chrome.tabs.getCurrent((tab) => {
    state.blankTabConfirmed = Boolean(tab?.url?.includes('newtab'));
    tryStartApp();
  });

  window.addEventListener('resize', handleResize);
  document.addEventListener('mouseup', handleMouseUp, true);
})();
