(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // wechat-debug/wx-shim.js
  var require_wx_shim = __commonJS({
    "wechat-debug/wx-shim.js"() {
      var canvas = document.querySelector("#game");
      var listeners = { start: [], move: [], end: [], cancel: [] };
      var storage = /* @__PURE__ */ new Map();
      window.__cangshanLoading?.set("\u51C6\u5907\u6D4F\u89C8\u5668\u8C03\u8BD5\u73AF\u5883", "\u521D\u59CB\u5316\u89E6\u6478\u3001\u97F3\u9891\u548C\u89C6\u9891\u6A21\u62DF\u5668\u3002", 0.08);
      function eventFromPointer(event) {
        const rect = canvas.getBoundingClientRect();
        return { changedTouches: [{ identifier: event.pointerId || 0, clientX: event.clientX - rect.left, clientY: event.clientY - rect.top }] };
      }
      canvas.addEventListener("pointerdown", (event) => {
        canvas.setPointerCapture(event.pointerId);
        listeners.start.forEach((handler) => handler(eventFromPointer(event)));
      });
      canvas.addEventListener("pointermove", (event) => {
        if (event.buttons) listeners.move.forEach((handler) => handler(eventFromPointer(event)));
      });
      canvas.addEventListener("pointerup", (event) => listeners.end.forEach((handler) => handler(eventFromPointer(event))));
      canvas.addEventListener("pointercancel", (event) => listeners.cancel.forEach((handler) => handler(eventFromPointer(event))));
      window.wx = {
        __assetBase: "../wechat-minigame/",
        createCanvas: () => canvas,
        createImage: () => new Image(),
        getSystemInfoSync: () => ({ windowWidth: 390, windowHeight: 844, screenWidth: 390, screenHeight: 844, pixelRatio: Math.min(2, window.devicePixelRatio || 1), safeArea: { top: 0, bottom: 844 } }),
        getMenuButtonBoundingClientRect: () => ({ top: 10, right: 378, bottom: 44, left: 292, width: 86, height: 34 }),
        onTouchStart: (handler) => listeners.start.push(handler),
        onTouchMove: (handler) => listeners.move.push(handler),
        onTouchEnd: (handler) => listeners.end.push(handler),
        onTouchCancel: (handler) => listeners.cancel.push(handler),
        getStorageSync: (key) => storage.get(key) || "",
        setStorageSync: (key, value) => storage.set(key, value),
        getLogManager: () => ({ log: (...args) => console.log(...args), warn: (...args) => console.warn(...args) }),
        loadSubpackage: ({ success }) => {
          queueMicrotask(() => success && success());
          return { onProgressUpdate() {
          } };
        },
        createInnerAudioContext: () => {
          const audio = new Audio();
          return {
            set src(value) {
              audio.src = value;
            },
            set loop(value) {
              audio.loop = value;
            },
            set volume(value) {
              audio.volume = value;
            },
            set obeyMuteSwitch(_value) {
            },
            play: () => audio.play().catch(() => {
            }),
            pause: () => audio.pause(),
            stop: () => {
              audio.pause();
              audio.currentTime = 0;
            },
            seek: (time) => {
              audio.currentTime = time;
            },
            onPlay: (handler) => audio.addEventListener("play", handler),
            onError: (handler) => audio.addEventListener("error", () => handler({ errMsg: "browser audio error" }))
          };
        },
        createVideo: (options) => createBrowserVideo(options)
      };
      function createBrowserVideo(options) {
        const video = document.createElement("video");
        video.dataset.wechatVideo = "true";
        video.src = options.src;
        video.autoplay = Boolean(options.autoplay);
        video.loop = Boolean(options.loop);
        video.muted = Boolean(options.muted);
        video.controls = Boolean(options.controls);
        video.playsInline = true;
        video.style.position = "fixed";
        video.style.zIndex = "10";
        video.style.objectFit = options.objectFit || "contain";
        video.style.background = options.backgroundColor || "#000";
        const place = () => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = rect.width / canvas.width;
          const scaleY = rect.height / canvas.height;
          video.style.left = `${rect.left + options.x * scaleX}px`;
          video.style.top = `${rect.top + options.y * scaleY}px`;
          video.style.width = `${options.width * scaleX}px`;
          video.style.height = `${options.height * scaleY}px`;
        };
        place();
        window.addEventListener("resize", place);
        document.body.appendChild(video);
        return {
          play: () => video.play().catch(() => {
          }),
          pause: () => video.pause(),
          stop: () => {
            video.pause();
            video.currentTime = 0;
          },
          show: () => {
            video.style.display = "block";
          },
          hide: () => {
            video.style.display = "none";
          },
          destroy: () => {
            window.removeEventListener("resize", place);
            video.remove();
          },
          onEnded: (handler) => video.addEventListener("ended", handler, { once: true }),
          onPlay: (handler) => video.addEventListener("play", handler),
          onTimeUpdate: (handler) => video.addEventListener("timeupdate", handler),
          onWaiting: (handler) => video.addEventListener("waiting", handler),
          onError: (handler) => video.addEventListener("error", () => handler({ errMsg: "browser video error" }), { once: true })
        };
      }
    }
  });

  // wechat-minigame/js/config.js
  var require_config = __commonJS({
    "wechat-minigame/js/config.js"(exports, module) {
      var GAME = {
        title: "\u82CD\u5C71\u4FA0\u5F71",
        subtitle: "\u98CE\u8D77\u4E91\u5CAD \xB7 \u65E7\u6848\u65B0\u8E2A",
        heroName: "\u6C88\u4E34\u5DDD",
        companionName: "\u82CF\u841D",
        tileSize: 64,
        playerSpeed: 220,
        playerCollision: { width: 34, height: 28 },
        sprite: {
          frameWidth: 313,
          frameHeight: 313,
          framesPerDirection: 4,
          directions: ["down", "left", "right", "up"],
          walkSequence: [0, 1, 0, 3],
          frameDuration: 0.105,
          drawWidth: 96,
          drawHeight: 96
        }
      };
      var ASSETS = {
        worldWest: "world-west-pack/world-west.png",
        worldEast: "world-east-pack/world-east.png",
        moonValley: "moon-valley-pack/moon-valley.png",
        room: "room-pack/inn-room.png",
        apothecaryRoom: "room-pack/apothecary-room.png",
        teahouseRoom: "room-pack/teahouse-room.png",
        moonMedicineHall: "room-pack/moon-valley-medicine-hall.png",
        moonStudy: "room-pack/moon-valley-study.png",
        worldMap: "world-map-pack/world-map.png",
        hero: "character-pack/hero.png",
        heroAttack: "character-pack/hero-attack.png",
        companion: "character-pack/companion.png",
        scout: "character-pack/scout.png",
        scoutArcher: "character-pack/scout-archer.png",
        monkGuard: "character-pack/monk-guard.png",
        yipintangLeader: "character-pack/yipintang-leader.png",
        vendor: "character-pack/vendor.png",
        keeper: "character-pack/keeper.png",
        daoistMaster: "character-pack/daoist-master.png",
        qinWanyao: "character-pack/qin-wanyao.png",
        muZhiyan: "character-pack/mu-zhiyan.png",
        moonValleyDisciple: "character-pack/moon-valley-disciple.png",
        moonValleyTraitor: "character-pack/moon-valley-traitor.png",
        xiaoBeichen: "character-pack/xiao-beichen.png",
        xuYunsheng: "character-pack/xu-yunsheng.png",
        lianZhao: "character-pack/lian-zhao.png",
        rongQingxuan: "character-pack/rong-qingxuan.png",
        xiaoCangming: "character-pack/xiao-cangming.png",
        rongJinghuai: "character-pack/rong-jinghuai.png",
        wuChenseng: "character-pack/wu-chenseng.png",
        shenYuanhe: "character-pack/shen-yuanhe.png",
        battleTemple: "battle-pack/battle-temple.png",
        battleFerry: "battle-pack/battle-ferry.png",
        battleBamboo: "battle-pack/battle-bamboo.png",
        daoistCutscenePoster: "video-pack/fuyao-poster.png",
        bgm: "audio-pack/cangshan-road.m4a",
        battleBgm: "audio-pack/iron-fan-valley.mp3",
        hitSfx: "audio-pack/hit.wav",
        stunSfx: "audio-pack/stun.wav",
        healSfx: "audio-pack/heal.wav",
        sweepSfx: "audio-pack/sweep.wav",
        uiSfx: "audio-pack/ui.wav",
        promptSfx: "audio-pack/prompt.wav",
        buySfx: "audio-pack/buy.wav",
        waitSfx: "audio-pack/wait.wav"
      };
      var BATTLE = {
        title: "\u897F\u5CAD\u5BC6\u63A2",
        cols: 7,
        rows: 9,
        objective: "\u51FB\u9000\u4F0F\u5175",
        players: [
          { id: "hero", name: GAME.heroName, sprite: "hero", attackSprite: "heroAttack", side: "player", x: 2, y: 7, hp: 88, qi: 110, move: 3, range: 2, damage: 32, skillIds: ["guiyuan_sword", "daze", "whirlwind"] },
          { id: "companion", name: GAME.companionName, sprite: "companion", side: "player", x: 1, y: 7, hp: 72, qi: 90, move: 3, range: 1, damage: 24, skillIds: ["quick_slash", "heal", "guard_break"] }
        ],
        enemies: [
          { id: "scoutA", name: "\u6697\u54E8\u7532", sprite: "scout", side: "enemy", x: 4, y: 7, hp: 38, qi: 40, move: 2, range: 1, damage: 18, skillIds: ["quick_slash"] },
          { id: "scoutB", name: "\u7AF9\u6797\u5F29\u624B", sprite: "scoutArcher", side: "enemy", x: 5, y: 5, hp: 46, qi: 40, move: 2, range: 2, damage: 16, skillIds: ["arrow_shot"] }
        ],
        skills: {
          basic_attack: { id: "basic_attack", name: "\u666E\u901A\u653B\u51FB", cost: 0, range: 1, kind: "basic", effect: "\u76F8\u90BB\u683C\u7269\u7406\u653B\u51FB" },
          quick_slash: { id: "quick_slash", name: "\u75BE\u65A9", cost: 0, range: 1, damage: 24, kind: "single", effect: "\u8FD1\u8EAB\u653B\u51FB" },
          guiyuan_sword: { id: "guiyuan_sword", name: "\u5F52\u5143\u5251\u6C14", cost: 35, range: 2, damage: 38, kind: "single", effect: "\u8FDC\u8DDD\u5251\u6C14" },
          daze: { id: "daze", name: "\u70B9\u7A74", cost: 45, range: 3, damage: 18, kind: "single", status: "stunned", statusTurns: 1, effect: "\u4F24\u5BB3\u5E76\u6655\u7729\u4E00\u56DE\u5408" },
          whirlwind: { id: "whirlwind", name: "\u56DE\u98CE\u626B\u53F6", cost: 55, range: 1, damage: 24, kind: "aoe", radius: 1, effect: "\u547D\u4E2D\u76EE\u6807\u5468\u56F4\u654C\u4EBA" },
          heal: { id: "heal", name: "\u56DE\u6625\u6563", cost: 30, range: 0, heal: 24, kind: "ally_all", effect: "\u6211\u65B9\u5168\u4F53\u56DE\u8840" },
          guard_break: { id: "guard_break", name: "\u7834\u7532\u523A", cost: 35, range: 1, damage: 22, kind: "single", status: "exposed", statusTurns: 2, effect: "\u7834\u9632\u4E24\u56DE\u5408" },
          arrow_shot: { id: "arrow_shot", name: "\u8896\u5F29", cost: 0, range: 2, damage: 16, kind: "single", effect: "\u8FDC\u7A0B\u5C04\u51FB" },
          rally: { id: "rally", name: "\u632F\u594B", cost: 25, range: 0, qiRestore: 18, kind: "ally_all", effect: "\u6211\u65B9\u56DE\u590D\u771F\u6C14" },
          fuyou_step: { id: "fuyou_step", name: "\u6276\u6447\u8BC0", cost: 50, range: 3, damage: 30, kind: "aoe", radius: 1, status: "stunned", statusTurns: 1, effect: "\u5FA1\u98CE\u7FA4\u653B\u5E76\u4F7F\u654C\u4EBA\u6655\u7729" }
        },
        rewards: {
          money: { min: 18, max: 35 },
          drops: [
            { itemId: "hemostatic_powder", name: "\u6B62\u8840\u6563", chance: 1, min: 1, max: 1 },
            { itemId: "qingxin_pill", name: "\u6E05\u5FC3\u4E38", chance: 0.42, min: 1, max: 1 },
            { itemId: "scout_token", name: "\u5BC6\u63A2\u4EE4\u724C", chance: 0.35, min: 1, max: 1 },
            { itemId: "steel_saber", name: "\u96C1\u7FCE\u5200", chance: 0.12, min: 1, max: 1 }
          ]
        }
      };
      var SCOUT_IDS = ["scout", "scout_bridge", "scout_archer", "scout_road", "scout_monk", "scout_gate"];
      var WORLD_NODES = [
        { id: "cangshan", name: "\u82CD\u5C71\u65E7\u9053", x: 168, y: 610, status: "current" },
        { id: "yuehua", name: "\u6708\u534E\u8C37", x: 242, y: 486, status: "locked" },
        { id: "erhai", name: "\u6D31\u6D77\u6E21\u53E3", x: 292, y: 430, status: "locked" },
        { id: "jianhu", name: "\u5251\u6E56\u5BAB\u9053", x: 122, y: 176, status: "locked" }
      ];
      var ROOM_COLLISIONS = [
        { x: 0, y: 0, width: 1280, height: 80 },
        { x: 110, y: 145, width: 300, height: 175 },
        { x: 520, y: 350, width: 250, height: 118 },
        { x: 948, y: 100, width: 230, height: 350 },
        { x: 220, y: 455, width: 220, height: 120 },
        { x: 0, y: 0, width: 40, height: 768 },
        { x: 1240, y: 0, width: 40, height: 768 }
      ];
      var ROOM_TRIGGERS = [
        { id: "roomExit", x: 520, y: 650, width: 240, height: 118, label: "\u79BB\u5F00\u623F\u95F4" },
        { id: "wardrobe", x: 930, y: 240, width: 260, height: 250, label: "\u641C\u7D22\u6728\u67DC" },
        { id: "desk", x: 650, y: 100, width: 285, height: 190, label: "\u67E5\u770B\u8D26\u518C" }
      ];
      var APOTHECARY_COLLISIONS = [
        { x: 0, y: 0, width: 1280, height: 78 },
        { x: 0, y: 0, width: 40, height: 768 },
        { x: 1240, y: 0, width: 40, height: 768 },
        { x: 0, y: 704, width: 520, height: 64 },
        { x: 760, y: 704, width: 520, height: 64 },
        { x: 68, y: 104, width: 240, height: 360 },
        { x: 382, y: 104, width: 500, height: 105 },
        { x: 375, y: 282, width: 485, height: 72 },
        { x: 1010, y: 104, width: 160, height: 330 },
        { x: 850, y: 455, width: 190, height: 120 },
        { x: 446, y: 672, width: 58, height: 48 },
        { x: 782, y: 672, width: 58, height: 48 }
      ];
      var APOTHECARY_TRIGGERS = [
        { id: "roomExit", x: 520, y: 650, width: 240, height: 118, label: "\u79BB\u5F00\u767E\u8349\u94FA" },
        { id: "wardrobe", x: 970, y: 105, width: 230, height: 260, label: "\u641C\u7D22\u836F\u67DC" },
        { id: "desk", x: 580, y: 210, width: 300, height: 160, label: "\u67E5\u770B\u836F\u65B9" }
      ];
      var TEAHOUSE_COLLISIONS = [
        { x: 0, y: 0, width: 1280, height: 78 },
        { x: 0, y: 0, width: 40, height: 768 },
        { x: 1240, y: 0, width: 40, height: 768 },
        { x: 0, y: 704, width: 520, height: 64 },
        { x: 760, y: 704, width: 520, height: 64 },
        { x: 76, y: 104, width: 280, height: 190 },
        { x: 445, y: 130, width: 480, height: 120 },
        { x: 1062, y: 104, width: 120, height: 350 },
        { x: 275, y: 340, width: 135, height: 82 },
        { x: 560, y: 320, width: 130, height: 80 },
        { x: 845, y: 340, width: 135, height: 82 },
        { x: 362, y: 522, width: 132, height: 88 },
        { x: 718, y: 522, width: 132, height: 88 },
        { x: 948, y: 620, width: 198, height: 84 }
      ];
      var TEAHOUSE_TRIGGERS = [
        { id: "roomExit", x: 520, y: 650, width: 240, height: 118, label: "\u79BB\u5F00\u8336\u8086" },
        { id: "wardrobe", x: 100, y: 255, width: 180, height: 120, label: "\u641C\u7D22\u8336\u7BB1" },
        { id: "desk", x: 850, y: 100, width: 220, height: 170, label: "\u67E5\u770B\u544A\u793A" }
      ];
      var MOON_ROOM_COLLISIONS = [
        { x: 0, y: 0, width: 1280, height: 72 },
        { x: 0, y: 0, width: 36, height: 768 },
        { x: 1244, y: 0, width: 36, height: 768 },
        { x: 0, y: 708, width: 520, height: 60 },
        { x: 760, y: 708, width: 520, height: 60 }
      ];
      var MOON_MEDICINE_COLLISIONS = [
        ...MOON_ROOM_COLLISIONS,
        { x: 70, y: 84, width: 250, height: 390 },
        { x: 340, y: 72, width: 570, height: 168 },
        { x: 948, y: 92, width: 254, height: 262 },
        { x: 515, y: 360, width: 335, height: 135 },
        { x: 72, y: 602, width: 218, height: 96 },
        { x: 930, y: 542, width: 260, height: 125 }
      ];
      var MOON_STUDY_COLLISIONS = [
        ...MOON_ROOM_COLLISIONS,
        { x: 60, y: 60, width: 205, height: 206 },
        { x: 305, y: 50, width: 360, height: 198 },
        { x: 705, y: 210, width: 345, height: 118 },
        { x: 150, y: 448, width: 238, height: 96 },
        { x: 1015, y: 478, width: 174, height: 120 },
        { x: 1116, y: 285, width: 118, height: 185 },
        { x: 235, y: 278, width: 230, height: 142 }
      ];
      var MOON_ROOM_TRIGGERS = [
        { id: "roomExit", x: 520, y: 650, width: 240, height: 118, label: "\u79BB\u5F00\u6708\u534E\u8C37\u623F\u95F4" },
        { id: "wardrobe", x: 940, y: 125, width: 230, height: 220, label: "\u641C\u7D22\u67DC\u67B6" },
        { id: "desk", x: 690, y: 160, width: 330, height: 180, label: "\u67E5\u770B\u6848\u5377" }
      ];
      var MAPS = {
        world: {
          id: "world",
          images: [
            { id: "worldWest", x: 0, y: 0 },
            { id: "worldEast", x: 2240, y: 0 }
          ],
          width: 4480,
          height: 3584,
          spawn: { x: 2700, y: 2520 },
          collisions: [
            { x: 0, y: 0, width: 4480, height: 72 },
            { x: 0, y: 3512, width: 4480, height: 72 },
            { x: 0, y: 0, width: 72, height: 3584 },
            { x: 4408, y: 0, width: 72, height: 3584 },
            { x: 2140, y: 520, width: 860, height: 540 },
            { x: 2650, y: 1960, width: 690, height: 285 },
            { x: 3008, y: 2368, width: 256, height: 156 }
          ],
          triggers: [
            { id: "inn", x: 2680, y: 2260, width: 360, height: 260, label: "\u8FDB\u5165\u4E91\u6765\u5BA2\u6808" },
            { id: "apothecaryDoor", x: 3290, y: 2320, width: 340, height: 260, label: "\u8FDB\u5165\u767E\u8349\u94FA" },
            { id: "teahouseDoor", x: 2160, y: 1060, width: 360, height: 260, label: "\u8FDB\u5165\u677E\u98CE\u8336\u8086" },
            { id: "moonValleyGate", x: 3e3, y: 1320, width: 360, height: 300, label: "\u524D\u5F80\u6708\u534E\u8C37" },
            { id: "vendor", x: 3260, y: 2500, width: 220, height: 220, label: "\u8BE2\u95EE\u836F\u644A\u8001\u4EBA" },
            { id: "daoist_master", x: 2580, y: 2740, width: 360, height: 300, label: "\u62DC\u4F1A\u900D\u9065\u9053\u4EBA" },
            { id: "scout", x: 2520, y: 2500, width: 260, height: 230, label: "\u6311\u6218\u897F\u5CAD\u5BC6\u63A2" },
            { id: "scout_bridge", x: 2240, y: 2220, width: 260, height: 230, label: "\u6311\u6218\u6865\u5934\u6697\u54E8" },
            { id: "scout_archer", x: 2040, y: 1840, width: 260, height: 230, label: "\u6311\u6218\u7AF9\u6797\u5F29\u624B" },
            { id: "scout_road", x: 2380, y: 1500, width: 260, height: 230, label: "\u6311\u6218\u62E6\u8DEF\u5BC6\u63A2" },
            { id: "scout_monk", x: 2700, y: 1320, width: 280, height: 230, label: "\u6311\u6218\u5BFA\u524D\u62A4\u536B" },
            { id: "scout_gate", x: 3100, y: 1640, width: 280, height: 230, label: "\u6311\u6218\u5C71\u95E8\u5BC6\u63A2" }
          ],
          npcs: [
            { id: "keeper", name: "\u5BA2\u6808\u638C\u67DC", sprite: "keeper", x: 2735, y: 2525, direction: "right" },
            { id: "vendor", name: "\u836F\u644A\u8001\u4EBA", sprite: "vendor", x: 3370, y: 2600, direction: "down" },
            { id: "daoist_master", name: "\u900D\u9065\u9053\u4EBA", sprite: "daoistMaster", x: 2780, y: 2890, direction: "down" },
            { id: "scout", name: "\u897F\u5CAD\u5BC6\u63A2", sprite: "scout", x: 2648, y: 2590, direction: "down" },
            { id: "scout_bridge", name: "\u6865\u5934\u6697\u54E8", sprite: "scout", x: 2368, y: 2310, direction: "down" },
            { id: "scout_archer", name: "\u7AF9\u6797\u5F29\u624B", sprite: "scoutArcher", x: 2168, y: 1930, direction: "down" },
            { id: "scout_road", name: "\u62E6\u8DEF\u5BC6\u63A2", sprite: "scout", x: 2508, y: 1590, direction: "down" },
            { id: "scout_monk", name: "\u5BFA\u524D\u62A4\u536B", sprite: "monkGuard", x: 2840, y: 1410, direction: "down" },
            { id: "scout_gate", name: "\u5C71\u95E8\u9996\u9886", sprite: "yipintangLeader", x: 3240, y: 1730, direction: "down" }
          ]
        },
        moonValley: {
          id: "moonValley",
          image: "moonValley",
          width: 780,
          height: 1688,
          spawn: { x: 390, y: 1575 },
          exitTo: { mapId: "world", spawn: { x: 3180, y: 1480 }, label: "\u8FD4\u56DE\u82CD\u5C71\u65E7\u9053" },
          collisions: [
            { x: 0, y: 0, width: 780, height: 24 },
            { x: 0, y: 1664, width: 780, height: 24 },
            { x: 0, y: 0, width: 28, height: 1688 },
            { x: 752, y: 0, width: 28, height: 1688 },
            { x: 0, y: 0, width: 145, height: 395 },
            { x: 600, y: 0, width: 180, height: 500 },
            { x: 228, y: 36, width: 332, height: 178 },
            { x: 5, y: 360, width: 230, height: 330 },
            { x: 470, y: 285, width: 280, height: 345 },
            { x: 45, y: 760, width: 235, height: 205 },
            { x: 512, y: 782, width: 232, height: 182 },
            { x: 560, y: 1040, width: 185, height: 205 },
            { x: 18, y: 1110, width: 230, height: 270 },
            { x: 560, y: 1285, width: 185, height: 220 },
            { x: 0, y: 1450, width: 220, height: 220 },
            { x: 565, y: 1500, width: 190, height: 180 }
          ],
          triggers: [
            { id: "moonValleyExit", x: 290, y: 1560, width: 200, height: 120, label: "\u8FD4\u56DE\u82CD\u5C71\u65E7\u9053" },
            { id: "moonStudyDoor", x: 320, y: 205, width: 140, height: 120, label: "\u8FDB\u5165\u6708\u534E\u4E66\u623F" },
            { id: "moonMedicineDoor", x: 570, y: 860, width: 150, height: 135, label: "\u8FDB\u5165\u6708\u534E\u836F\u5E90" },
            { id: "qin_wanyao", x: 315, y: 630, width: 160, height: 170, label: "\u62DC\u4F1A\u79E6\u665A\u7476" },
            { id: "mu_zhiyan", x: 480, y: 1080, width: 160, height: 170, label: "\u8BE2\u95EE\u7A46\u82B7\u70DF" },
            { id: "moon_disciple", x: 300, y: 1360, width: 170, height: 180, label: "\u8BE2\u95EE\u6708\u534E\u5F1F\u5B50" },
            { id: "scout_moon", x: 340, y: 500, width: 170, height: 170, label: "\u6311\u6218\u8C37\u4E2D\u53DB\u5F92" }
          ],
          npcs: [
            { id: "qin_wanyao", name: "\u79E6\u665A\u7476", sprite: "qinWanyao", x: 392, y: 700, direction: "down" },
            { id: "mu_zhiyan", name: "\u7A46\u82B7\u70DF", sprite: "muZhiyan", x: 555, y: 1160, direction: "left" },
            { id: "moon_disciple", name: "\u6708\u534E\u5F1F\u5B50", sprite: "moonValleyDisciple", x: 385, y: 1450, direction: "up" },
            { id: "scout_moon", name: "\u8C37\u4E2D\u53DB\u5F92", sprite: "moonValleyTraitor", x: 425, y: 575, direction: "down" }
          ]
        },
        moonMedicineHall: {
          id: "moonMedicineHall",
          image: "moonMedicineHall",
          width: 1280,
          height: 768,
          spawn: { x: 610, y: 650 },
          exitTo: { mapId: "moonValley", spawn: { x: 638, y: 1010 }, label: "\u79BB\u5F00\u6708\u534E\u836F\u5E90" },
          collisions: MOON_MEDICINE_COLLISIONS,
          triggers: MOON_ROOM_TRIGGERS,
          npcs: [{ id: "qin_wanyao", name: "\u79E6\u665A\u7476", sprite: "qinWanyao", x: 610, y: 305, direction: "down" }]
        },
        moonStudy: {
          id: "moonStudy",
          image: "moonStudy",
          width: 1280,
          height: 768,
          spawn: { x: 610, y: 650 },
          exitTo: { mapId: "moonValley", spawn: { x: 390, y: 345 }, label: "\u79BB\u5F00\u6708\u534E\u4E66\u623F" },
          collisions: MOON_STUDY_COLLISIONS,
          triggers: MOON_ROOM_TRIGGERS,
          npcs: [{ id: "mu_zhiyan", name: "\u7A46\u82B7\u70DF", sprite: "muZhiyan", x: 880, y: 385, direction: "left" }]
        },
        room: {
          id: "room",
          image: "room",
          width: 1280,
          height: 768,
          spawn: { x: 610, y: 650 },
          exitTo: { mapId: "world", spawn: { x: 2700, y: 2520 }, label: "\u79BB\u5F00\u5BA2\u623F" },
          collisions: ROOM_COLLISIONS,
          triggers: ROOM_TRIGGERS,
          npcs: [{ id: "companion", name: "\u82CF\u841D", sprite: "companion", x: 540, y: 260, direction: "down" }]
        },
        apothecaryRoom: {
          id: "apothecaryRoom",
          image: "apothecaryRoom",
          width: 1280,
          height: 768,
          spawn: { x: 610, y: 650 },
          exitTo: { mapId: "world", spawn: { x: 3370, y: 2580 }, label: "\u79BB\u5F00\u767E\u8349\u94FA" },
          collisions: APOTHECARY_COLLISIONS,
          triggers: APOTHECARY_TRIGGERS,
          npcs: [{ id: "vendor", name: "\u836F\u644A\u8001\u4EBA", sprite: "vendor", x: 540, y: 260, direction: "down" }]
        },
        teahouseRoom: {
          id: "teahouseRoom",
          image: "teahouseRoom",
          width: 1280,
          height: 768,
          spawn: { x: 610, y: 650 },
          exitTo: { mapId: "world", spawn: { x: 2320, y: 1320 }, label: "\u79BB\u5F00\u677E\u98CE\u8336\u8086" },
          collisions: TEAHOUSE_COLLISIONS,
          triggers: TEAHOUSE_TRIGGERS,
          npcs: [{ id: "keeper", name: "\u8336\u8086\u638C\u67DC", sprite: "keeper", x: 540, y: 260, direction: "down" }]
        }
      };
      module.exports = { GAME, ASSETS, MAPS, BATTLE, SCOUT_IDS, WORLD_NODES };
    }
  });

  // wechat-minigame/js/platform.js
  var require_platform = __commonJS({
    "wechat-minigame/js/platform.js"(exports, module) {
      function systemInfo() {
        const info = wx.getSystemInfoSync();
        const width = info.windowWidth || info.screenWidth || 390;
        const height = info.windowHeight || info.screenHeight || 844;
        const menuButton = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
        return { width, height, dpr: info.pixelRatio || 1, safeArea: info.safeArea || { top: 0, bottom: height }, menuButton };
      }
      function createSurface() {
        const canvas = wx.createCanvas();
        const viewport = systemInfo();
        canvas.width = Math.round(viewport.width * viewport.dpr);
        canvas.height = Math.round(viewport.height * viewport.dpr);
        if (canvas.style) {
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
        }
        const context = canvas.getContext("2d");
        context.scale(viewport.dpr, viewport.dpr);
        context.imageSmoothingEnabled = false;
        return { canvas, context, viewport };
      }
      function loadImage(canvas, source) {
        return new Promise((resolve, reject) => {
          const image = canvas.createImage ? canvas.createImage() : wx.createImage();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error(`Image failed to load: ${source}`));
          image.src = `${wx.__assetBase || ""}${source}`;
        });
      }
      function createAudio(source) {
        const audio = wx.createInnerAudioContext();
        audio.src = `${wx.__assetBase || ""}${source}`;
        audio.loop = true;
        audio.volume = 0.38;
        audio.audit = { source, playCount: 0, pauseCount: 0 };
        const play = audio.play.bind(audio);
        const pause = audio.pause.bind(audio);
        audio.play = () => {
          audio.audit.playCount += 1;
          return play();
        };
        audio.pause = () => {
          audio.audit.pauseCount += 1;
          return pause();
        };
        return audio;
      }
      function createSfx(source) {
        const audio = wx.createInnerAudioContext();
        audio.src = `${wx.__assetBase || ""}${source}`;
        audio.loop = false;
        audio.volume = 1;
        audio.obeyMuteSwitch = false;
        const audit = { source, playCount: 0, playEvents: 0, errors: [] };
        audio.onPlay?.(() => {
          audit.playEvents += 1;
          console.info?.("[sfx] play", { source, playEvents: audit.playEvents });
        });
        audio.onError?.((error) => {
          const message = error?.errMsg || error?.message || "sfx playback failed";
          audit.errors.push(message);
          console.warn?.("[sfx] error", { source, error: message, raw: error });
        });
        return {
          audit,
          play() {
            audit.playCount += 1;
            console.info?.("[sfx] trigger", { source, playCount: audit.playCount });
            if (audio.stop) audio.stop();
            if (audio.seek) audio.seek(0);
            audio.play();
          }
        };
      }
      function loadAssetPacks() {
        if (!wx.loadSubpackage) return Promise.resolve();
        const packs = ["worldWestPack", "worldEastPack", "worldMapPack", "moonValleyPack", "roomPack", "characterPack", "audioPack", "battlePack", "videoPack"];
        let loaded = 0;
        const load = (name) => new Promise((resolve, reject) => wx.loadSubpackage({
          name,
          success: () => {
            loaded += 1;
            globalThis.__cangshanLoading?.set("\u52A0\u8F7D\u8D44\u6E90\u5206\u5305", `${loaded}/${packs.length} ${name}`, 0.1 + loaded / packs.length * 0.14);
            resolve();
          },
          fail: (error) => reject(new Error(`Subpackage failed to load: ${name} ${error?.errMsg || ""}`))
        }));
        return Promise.all(packs.map(load));
      }
      function readSave(key) {
        try {
          return wx.getStorageSync(key) || null;
        } catch {
          return null;
        }
      }
      function writeSave(key, value) {
        try {
          wx.setStorageSync(key, value);
        } catch (error) {
          console.warn("Save failed", error);
        }
      }
      module.exports = { createSurface, loadImage, createAudio, createSfx, loadAssetPacks, readSave, writeSave };
    }
  });

  // wechat-minigame/js/player.js
  var require_player = __commonJS({
    "wechat-minigame/js/player.js"(exports, module) {
      var { GAME } = require_config();
      var Player = class {
        constructor(image, spawn) {
          this.image = image;
          this.x = spawn.x;
          this.y = spawn.y;
          this.direction = "down";
          this.frame = 0;
          this.elapsed = 0;
          this.sequenceIndex = 0;
        }
        boundsAt(x, y) {
          const size = GAME.playerCollision;
          return { x: x - size.width / 2, y: y - size.height, width: size.width, height: size.height };
        }
        update(dt, axis, canMove) {
          const moving = axis.x !== 0 || axis.y !== 0;
          if (axis.x < 0) this.direction = "left";
          if (axis.x > 0) this.direction = "right";
          if (axis.y < 0) this.direction = "up";
          if (axis.y > 0) this.direction = "down";
          if (moving) {
            const length = Math.hypot(axis.x, axis.y) || 1;
            const dx = axis.x / length * GAME.playerSpeed * dt;
            const dy = axis.y / length * GAME.playerSpeed * dt;
            if (canMove(this.boundsAt(this.x + dx, this.y))) this.x += dx;
            if (canMove(this.boundsAt(this.x, this.y + dy))) this.y += dy;
            this.elapsed += dt;
            if (this.elapsed >= GAME.sprite.frameDuration) {
              this.elapsed %= GAME.sprite.frameDuration;
              this.sequenceIndex = (this.sequenceIndex + 1) % GAME.sprite.walkSequence.length;
              this.frame = GAME.sprite.walkSequence[this.sequenceIndex];
            }
          } else {
            this.frame = 0;
            this.elapsed = 0;
            this.sequenceIndex = 0;
          }
        }
        draw(context, camera) {
          drawSprite(context, this.image, this.x - camera.x, this.y - camera.y, this.direction, this.frame, GAME.sprite.drawWidth, GAME.sprite.drawHeight);
        }
      };
      function drawSprite(context, image, x, y, direction = "down", frame = 0, width = 82, height = 82) {
        const sprite = GAME.sprite;
        const row = Math.max(0, sprite.directions.indexOf(direction));
        const frameWidth = Math.floor((image.width || sprite.frameWidth * sprite.framesPerDirection) / sprite.framesPerDirection);
        const frameHeight = Math.floor((image.height || sprite.frameHeight * sprite.directions.length) / sprite.directions.length);
        context.drawImage(
          image,
          frame * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
          Math.round(x - width / 2),
          Math.round(y - height * 0.86),
          width,
          height
        );
      }
      module.exports = { Player, drawSprite };
    }
  });

  // wechat-minigame/js/mapManager.js
  var require_mapManager = __commonJS({
    "wechat-minigame/js/mapManager.js"(exports, module) {
      var { MAPS } = require_config();
      var MapManager = class {
        constructor(images, viewport) {
          this.images = images;
          this.viewport = viewport;
          this.enter("world");
        }
        enter(id) {
          this.map = MAPS[id];
          this.id = id;
          return this.map.spawn;
        }
        canMove(bounds) {
          if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > this.map.width || bounds.y + bounds.height > this.map.height) return false;
          return !this.map.collisions.some((wall) => intersects(bounds, wall));
        }
        nearby(bounds, margin = 72) {
          const expanded = { x: bounds.x - margin, y: bounds.y - margin, width: bounds.width + margin * 2, height: bounds.height + margin * 2 };
          const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
          return this.map.triggers.filter((trigger) => intersects(expanded, trigger)).map((trigger) => ({
            trigger,
            distance: Math.hypot(center.x - (trigger.x + trigger.width / 2), center.y - (trigger.y + trigger.height / 2))
          })).sort((a, b) => a.distance - b.distance)[0]?.trigger || null;
        }
        cameraFor(player, playRect) {
          return {
            x: clamp(player.x - playRect.width / 2, 0, Math.max(0, this.map.width - playRect.width)),
            y: clamp(player.y - playRect.height / 2, 0, Math.max(0, this.map.height - playRect.height))
          };
        }
        draw(context, camera, playRect) {
          context.save();
          context.beginPath();
          context.rect(playRect.x, playRect.y, playRect.width, playRect.height);
          context.clip();
          context.translate(playRect.x, playRect.y);
          if (this.map.images) {
            for (const layer of this.map.images) {
              context.drawImage(this.images[layer.id], Math.round(layer.x - camera.x), Math.round(layer.y - camera.y));
            }
          } else {
            context.drawImage(this.images[this.map.image], -Math.round(camera.x), -Math.round(camera.y));
          }
          context.restore();
        }
        drawDebug(context, camera, playRect) {
          const tile = 64;
          context.save();
          context.beginPath();
          context.rect(playRect.x, playRect.y, playRect.width, playRect.height);
          context.clip();
          context.translate(playRect.x - camera.x, playRect.y - camera.y);
          context.lineWidth = 1;
          context.strokeStyle = "rgba(245, 234, 208, 0.28)";
          const startX = Math.floor(camera.x / tile) * tile;
          const endX = camera.x + playRect.width;
          const startY = Math.floor(camera.y / tile) * tile;
          const endY = camera.y + playRect.height;
          for (let x = startX; x <= endX; x += tile) {
            context.beginPath();
            context.moveTo(x + 0.5, camera.y);
            context.lineTo(x + 0.5, endY);
            context.stroke();
          }
          for (let y = startY; y <= endY; y += tile) {
            context.beginPath();
            context.moveTo(camera.x, y + 0.5);
            context.lineTo(endX, y + 0.5);
            context.stroke();
          }
          for (const wall of this.map.collisions || []) {
            context.fillStyle = "rgba(220, 54, 42, 0.30)";
            context.strokeStyle = "rgba(255, 78, 64, 0.92)";
            context.fillRect(wall.x, wall.y, wall.width, wall.height);
            context.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.width, wall.height);
          }
          for (const trigger of this.map.triggers || []) {
            context.fillStyle = "rgba(72, 164, 255, 0.24)";
            context.strokeStyle = "rgba(104, 190, 255, 0.92)";
            context.fillRect(trigger.x, trigger.y, trigger.width, trigger.height);
            context.strokeRect(trigger.x + 0.5, trigger.y + 0.5, trigger.width, trigger.height);
          }
          context.restore();
        }
      };
      function intersects(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
      }
      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }
      module.exports = { MapManager };
    }
  });

  // wechat-minigame/js/dialogSystem.js
  var require_dialogSystem = __commonJS({
    "wechat-minigame/js/dialogSystem.js"(exports, module) {
      var DialogSystem = class {
        constructor() {
          this.pages = [];
          this.index = 0;
          this.onFinish = null;
        }
        get active() {
          return this.pages.length > 0;
        }
        get page() {
          return this.pages[this.index] || null;
        }
        show(pages, onFinish) {
          this.pages = Array.isArray(pages) ? pages : [pages];
          this.index = 0;
          this.onFinish = onFinish || null;
        }
        advance(choiceIndex = 0) {
          const current = this.page;
          if (!current) return;
          if (current.choices && current.choices[choiceIndex]?.action) current.choices[choiceIndex].action();
          if (this.index < this.pages.length - 1) {
            this.index += 1;
            return;
          }
          const done = this.onFinish;
          this.pages = [];
          this.index = 0;
          this.onFinish = null;
          if (done) done();
        }
      };
      module.exports = { DialogSystem };
    }
  });

  // wechat-minigame/js/uiRenderer.js
  var require_uiRenderer = __commonJS({
    "wechat-minigame/js/uiRenderer.js"(exports, module) {
      var { GAME } = require_config();
      var UiRenderer = class {
        constructor(viewport) {
          this.viewport = viewport;
          this.buttons = [];
          const capsuleBottom = viewport.menuButton?.bottom || 44;
          this.headerHeight = Math.max(126, capsuleBottom + 78);
          this.playRect = { x: 0, y: this.headerHeight, width: viewport.width, height: viewport.height - this.headerHeight - 122 };
        }
        render(context, state) {
          this.buttons = [];
          this.lastState = state;
          if (state.mode === "menu") return this.renderMenu(context, state);
          this.renderHud(context, state);
          if (state.dialog.active) this.renderDialog(context, state.dialog.page);
          else this.renderControls(context, state.activeTrigger);
        }
        renderCutscene(context, state) {
          this.buttons = [];
          context.fillStyle = "#080806";
          context.fillRect(0, 0, this.viewport.width, this.viewport.height);
          if (state.fallback) this.renderCutsceneFallback(context, state);
          context.fillStyle = "rgba(24, 19, 13, 0.98)";
          context.fillRect(0, 0, this.viewport.width, 54);
          context.textAlign = "left";
          context.fillStyle = "#f3e4bf";
          context.font = "700 17px serif";
          context.fillText(state.title || "\u6C5F\u6E56\u4F20\u529F", 18, 33);
          context.textAlign = "center";
          context.fillStyle = state.fallback ? "#e6c77c" : "#cdb57d";
          context.font = "12px sans-serif";
          const debugText = state.debug ? `video:${state.debug.event}  play:${state.debug.playEvent ? "Y" : "N"}  frames:${state.debug.timeUpdates || 0}${state.debug.error ? `  ${state.debug.error}` : ""}` : "";
          context.fillText(state.fallback ? "\u89C6\u9891\u64AD\u653E\u53D7\u9650\uFF0C\u6B63\u5728\u64AD\u653E\u5206\u955C\u515C\u5E95" : "\u52A8\u753B\u64AD\u653E\u7ED3\u675F\u540E\u5C06\u81EA\u52A8\u8FD4\u56DE\u5267\u60C5", this.viewport.width / 2, this.viewport.height - 76);
          if (debugText) {
            context.fillStyle = "#8fc6ff";
            context.font = "10px monospace";
            context.fillText(debugText.slice(0, 56), this.viewport.width / 2, this.viewport.height - 60);
          }
          this.button(context, "cutscene:skip", 24, this.viewport.height - 52, this.viewport.width - 48, 38, "\u8DF3\u8FC7\u52A8\u753B", "normal");
        }
        renderCutsceneFallback(context, state) {
          const poster = state.images?.[state.fallback.poster];
          const x = 0;
          const y = 54;
          const width = this.viewport.width;
          const height = this.viewport.height - 138;
          if (poster) drawImageCover(context, poster, x, y, width, height);
          context.fillStyle = "rgba(8, 7, 5, 0.34)";
          context.fillRect(x, y, width, height);
          const elapsed = Math.max(0, Date.now() - state.fallback.startedAt);
          const progress = Math.min(1, elapsed / state.fallback.durationMs);
          context.fillStyle = "rgba(222, 184, 94, 0.92)";
          context.fillRect(22, this.viewport.height - 86, (width - 44) * progress, 3);
          context.textAlign = "center";
          context.fillStyle = "#f7e9c8";
          context.font = "700 20px serif";
          context.fillText("\u6276\u6447\u4F20\u529F", width / 2, this.viewport.height * 0.46);
          context.font = "14px sans-serif";
          context.fillText("\u900D\u9065\u9053\u4EBA\u4EE5\u6E05\u98CE\u5165\u8109\uFF0C\u4F20\u4F60\u5FA1\u98CE\u4E4B\u6CD5", width / 2, this.viewport.height * 0.46 + 30);
        }
        renderMenu(context, state) {
          const { width, height } = this.viewport;
          context.fillStyle = "#171510";
          context.fillRect(0, 0, width, height);
          if (state.images.worldEast) {
            context.globalAlpha = 0.48;
            context.drawImage(state.images.worldEast, 210, 1850, 930, 1560, 0, 0, width, height);
            context.globalAlpha = 1;
          }
          context.fillStyle = "rgba(12, 10, 7, 0.46)";
          context.fillRect(0, 0, width, height);
          context.textAlign = "center";
          context.fillStyle = "#f5e6bd";
          context.font = "700 38px serif";
          context.fillText(GAME.title, width / 2, height * 0.25);
          context.fillStyle = "#d8bd82";
          context.font = "15px serif";
          context.fillText(GAME.subtitle, width / 2, height * 0.25 + 34);
          const menuY = height * 0.4;
          const rowHeight = 48;
          const rowGap = 10;
          this.button(context, "resume", width / 2 - 112, menuY, 224, rowHeight, "\u8FD4\u56DE\u6E38\u620F", state.canResume ? "primary" : "disabled");
          this.button(context, "save", width / 2 - 112, menuY + (rowHeight + rowGap), 224, rowHeight, "\u4FDD\u5B58\u5B58\u6863", state.canResume ? "normal" : "disabled");
          this.button(context, "continue", width / 2 - 112, menuY + (rowHeight + rowGap) * 2, 224, rowHeight, state.hasSave ? "\u52A0\u8F7D\u5B58\u6863" : "\u6682\u65E0\u5B58\u6863", state.hasSave ? "normal" : "disabled");
          this.button(context, "new", width / 2 - 112, menuY + (rowHeight + rowGap) * 3, 224, rowHeight, "\u65B0\u5F00\u59CB\u6E38\u620F", "normal");
          this.button(context, "music", width / 2 - 112, menuY + (rowHeight + rowGap) * 4, 224, rowHeight, state.musicEnabled ? "\u97F3\u4E50\uFF1A\u5F00" : "\u97F3\u4E50\uFF1A\u5173", "normal");
          if (state.menuNotice) {
            context.fillStyle = state.menuNotice === "\u5B58\u6863\u6210\u529F" ? "#8fd09a" : "#e5c77e";
            context.font = "700 13px sans-serif";
            context.fillText(state.menuNotice, width / 2, menuY + (rowHeight + rowGap) * 5 + 18);
          }
          context.fillStyle = "rgba(246, 234, 209, 0.68)";
          context.font = "12px sans-serif";
          context.fillText("\u7AD6\u5C4F\u89E6\u63A7\u7248 \xB7 \u8F7B\u89E6\u65B9\u5411\u952E\u79FB\u52A8", width / 2, height - 38);
        }
        renderHud(context, state) {
          const width = this.viewport.width;
          context.fillStyle = "rgba(25, 20, 14, 0.94)";
          context.fillRect(0, 0, width, this.headerHeight);
          const titleY = Math.max(42, (this.viewport.safeArea?.top || 0) + 42);
          context.textAlign = "left";
          context.fillStyle = "#f2e5c8";
          context.font = "700 20px serif";
          context.fillText(GAME.heroName, 18, titleY);
          context.font = "14px sans-serif";
          context.fillStyle = "#d8bd82";
          context.fillText(`\u82CD\u5C71\u65E7\u9053  \xB7  HP 88/88  \xB7  \u94F6 ${state.money ?? 120}`, 18, titleY + 30);
          const menuTop = Math.max((this.viewport.menuButton?.bottom || 44) + 10, titleY + 56);
          this.button(context, "menu", width - 70, menuTop, 48, 44, "\u2261", "icon");
        }
        renderControls(context, trigger) {
          const h = this.viewport.height;
          context.fillStyle = "#171510";
          context.fillRect(0, this.playRect.y + this.playRect.height, this.viewport.width, h);
          const baseY = h - 72;
          this.directionButton(context, "left", 18, baseY - 34, 68, "left");
          this.directionButton(context, "up", 88, baseY - 70, 68, "up");
          this.directionButton(context, "down", 88, baseY + 2, 68, "down");
          this.directionButton(context, "right", 158, baseY - 34, 68, "right");
          this.button(context, "interact", this.viewport.width - 92, baseY - 38, 68, 68, trigger ? "\u4EA4\u4E92" : "\u67E5\u770B", trigger ? "primaryRound" : "disabledRound");
          this.button(context, "inventory", this.viewport.width - 166, baseY - 88, 68, 34, "\u80CC\u5305", "normal");
          if (this.lastState?.worldMapUnlocked) this.button(context, "worldmap", this.viewport.width - 92, baseY - 88, 68, 34, "\u8206\u56FE", "normal");
          if (trigger) {
            context.textAlign = "right";
            context.font = "13px sans-serif";
            context.fillStyle = "#ead5a3";
            context.fillText(trigger.label, this.viewport.width - 104, h - 76);
          }
        }
        directionButton(context, id, x, y, size, direction) {
          context.fillStyle = "rgba(50, 43, 32, 0.92)";
          context.strokeStyle = "rgba(224, 192, 126, 0.58)";
          roundedRect(context, x, y, size, size, 7);
          context.fill();
          context.stroke();
          const cx = x + size / 2;
          const cy = y + size / 2;
          const radius = 15;
          context.beginPath();
          if (direction === "left") {
            context.moveTo(cx - radius, cy);
            context.lineTo(cx + radius * 0.75, cy - radius);
            context.lineTo(cx + radius * 0.75, cy + radius);
          } else if (direction === "right") {
            context.moveTo(cx + radius, cy);
            context.lineTo(cx - radius * 0.75, cy - radius);
            context.lineTo(cx - radius * 0.75, cy + radius);
          } else if (direction === "up") {
            context.moveTo(cx, cy - radius);
            context.lineTo(cx - radius, cy + radius * 0.75);
            context.lineTo(cx + radius, cy + radius * 0.75);
          } else {
            context.moveTo(cx, cy + radius);
            context.lineTo(cx - radius, cy - radius * 0.75);
            context.lineTo(cx + radius, cy - radius * 0.75);
          }
          context.closePath();
          context.fillStyle = "#f5ead2";
          context.fill();
          this.buttons.push({ id, x, y, width: size, height: size, disabled: false });
        }
        renderWorldMap(context, state) {
          this.buttons = [];
          const { width, height } = this.viewport;
          context.fillStyle = "#171510";
          context.fillRect(0, 0, width, height);
          if (state.images.worldMap) {
            drawImageCover(context, state.images.worldMap, 0, 0, width, height);
            context.fillStyle = "rgba(12, 10, 7, 0.28)";
            context.fillRect(0, 0, width, height);
          }
          context.textAlign = "left";
          context.fillStyle = "#f4e6c6";
          context.font = "700 22px serif";
          context.fillText("\u6C5F\u6E56\u8206\u56FE", 20, this.headerHeight - 46);
          context.font = "12px sans-serif";
          context.fillStyle = "#dbc287";
          context.fillText(`\u82CD\u5C71\u636E\u70B9 ${state.cleared}/${state.total}`, 20, this.headerHeight - 22);
          for (const node of state.nodes) this.worldNode(context, node);
          this.button(context, "closeWorldMap", width - 86, this.headerHeight - 58, 66, 38, "\u8FD4\u56DE", "normal");
        }
        renderInventory(context, state) {
          this.buttons = [];
          const { width, height } = this.viewport;
          context.fillStyle = "#171510";
          context.fillRect(0, 0, width, height);
          context.fillStyle = "rgba(34, 28, 20, 0.98)";
          roundedRect(context, 12, this.headerHeight - 66, width - 24, height - this.headerHeight + 52, 6);
          context.fill();
          context.strokeStyle = "rgba(224, 192, 126, 0.58)";
          context.stroke();
          context.textAlign = "left";
          context.fillStyle = "#f4e6c6";
          context.font = "700 22px serif";
          context.fillText("\u80CC\u5305", 28, this.headerHeight - 28);
          context.font = "12px sans-serif";
          context.fillStyle = "#dbc287";
          context.fillText(`\u94F6\u4E24 ${state.money}`, 28, this.headerHeight - 8);
          this.button(context, "closeInventory", width - 86, this.headerHeight - 58, 66, 38, "\u8FD4\u56DE", "normal");
          const listY = this.headerHeight + 24;
          const entries = state.entries || [];
          if (!entries.length) {
            context.textAlign = "center";
            context.fillStyle = "rgba(245, 234, 210, 0.66)";
            context.font = "14px sans-serif";
            context.fillText("\u80CC\u5305\u91CC\u8FD8\u6CA1\u6709\u7269\u54C1", width / 2, listY + 82);
            return;
          }
          entries.slice(0, 8).forEach(({ item, amount }, index) => {
            const y = listY + index * 68;
            context.fillStyle = "rgba(18, 15, 10, 0.74)";
            roundedRect(context, 24, y, width - 48, 56, 5);
            context.fill();
            context.strokeStyle = "rgba(224, 192, 126, 0.22)";
            context.stroke();
            context.fillStyle = itemColor(item.rarity);
            roundedRect(context, 36, y + 10, 36, 36, 5);
            context.fill();
            context.textAlign = "center";
            context.fillStyle = "#19140e";
            context.font = "700 17px serif";
            context.fillText(item.name.slice(0, 1), 54, y + 34);
            context.textAlign = "left";
            context.fillStyle = "#f6ead2";
            context.font = "700 14px sans-serif";
            context.fillText(`${item.name} x${amount}`, 84, y + 22);
            context.fillStyle = "#cdb57d";
            context.font = "11px sans-serif";
            context.fillText(`${item.type} \xB7 ${item.rarity} \xB7 ${item.effect}`, 84, y + 40);
          });
        }
        renderShop(context, state) {
          this.buttons = [];
          const { width, height } = this.viewport;
          const shop = state.shop || { name: "\u5E97\u94FA", keeper: "\u638C\u67DC" };
          context.fillStyle = "#171510";
          context.fillRect(0, 0, width, height);
          context.fillStyle = "rgba(34, 28, 20, 0.98)";
          roundedRect(context, 12, this.headerHeight - 66, width - 24, height - this.headerHeight + 52, 6);
          context.fill();
          context.strokeStyle = "rgba(224, 192, 126, 0.58)";
          context.stroke();
          context.textAlign = "left";
          context.fillStyle = "#f4e6c6";
          context.font = "700 22px serif";
          context.fillText(shop.name, 28, this.headerHeight - 30);
          context.font = "12px sans-serif";
          context.fillStyle = "#dbc287";
          context.fillText(`${shop.keeper} \xB7 \u94F6\u4E24 ${state.money}`, 28, this.headerHeight - 8);
          this.button(context, "closeShop", width - 86, this.headerHeight - 58, 66, 38, "\u8FD4\u56DE", "normal");
          const entries = state.entries || [];
          const listY = this.headerHeight + 20;
          entries.slice(0, 6).forEach((entry, index) => {
            const { item, owned, price, limit } = entry;
            const y = listY + index * 76;
            const disabled = state.money < price || limit && owned >= limit;
            context.fillStyle = disabled ? "rgba(18, 15, 10, 0.48)" : "rgba(18, 15, 10, 0.78)";
            roundedRect(context, 24, y, width - 48, 64, 5);
            context.fill();
            context.strokeStyle = "rgba(224, 192, 126, 0.22)";
            context.stroke();
            context.fillStyle = itemColor(item.rarity);
            roundedRect(context, 36, y + 14, 36, 36, 5);
            context.fill();
            context.textAlign = "center";
            context.fillStyle = "#19140e";
            context.font = "700 17px serif";
            context.fillText(item.name.slice(0, 1), 54, y + 38);
            context.textAlign = "left";
            context.fillStyle = disabled ? "rgba(246, 234, 210, 0.48)" : "#f6ead2";
            context.font = "700 14px sans-serif";
            context.fillText(`${item.name} \xB7 ${price} \u4E24`, 84, y + 22);
            context.fillStyle = disabled ? "rgba(205, 181, 125, 0.46)" : "#cdb57d";
            context.font = "11px sans-serif";
            context.fillText(`${item.type} \xB7 ${item.effect}${limit ? ` \xB7 \u5DF2\u6709 ${owned}/${limit}` : ` \xB7 \u5DF2\u6709 ${owned}`}`, 84, y + 40);
            this.button(context, `shop:buy:${item.id}`, width - 82, y + 18, 48, 30, disabled ? "\u4E0D\u53EF" : "\u8D2D\u4E70", disabled ? "disabled" : "primary");
          });
          context.textAlign = "left";
          context.fillStyle = "#d9c28f";
          context.font = "12px sans-serif";
          drawWrappedText(context, state.message || "", 28, height - 58, width - 56, 20, 2);
          if (state.notice) this.toast(context, state.notice.text, state.notice.kind);
        }
        toast(context, text, kind = "success") {
          const width = this.viewport.width;
          const boxWidth = Math.min(width - 48, 286);
          const boxHeight = 54;
          const x = (width - boxWidth) / 2;
          const y = this.viewport.height * 0.46;
          context.fillStyle = kind === "success" ? "rgba(33, 70, 45, 0.94)" : "rgba(88, 58, 28, 0.94)";
          roundedRect(context, x, y, boxWidth, boxHeight, 8);
          context.fill();
          context.strokeStyle = kind === "success" ? "rgba(142, 224, 160, 0.72)" : "rgba(240, 195, 115, 0.72)";
          context.stroke();
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillStyle = "#f5ead2";
          context.font = "700 16px sans-serif";
          context.fillText(text, width / 2, y + boxHeight / 2);
          context.textBaseline = "alphabetic";
        }
        renderDialog(context, page) {
          const width = this.viewport.width;
          const choices = page.choices || [{ label: "\u7EE7\u7EED" }];
          const boxHeight = 174 + Math.max(0, choices.length - 1) * 48;
          const y = this.viewport.height - boxHeight - 12;
          context.fillStyle = "rgba(20, 16, 11, 0.96)";
          roundedRect(context, 10, y, width - 20, boxHeight, 6);
          context.fill();
          context.strokeStyle = "rgba(220, 186, 116, 0.55)";
          context.stroke();
          context.textAlign = "left";
          context.fillStyle = "#e3c98f";
          context.font = "700 15px serif";
          context.fillText(page.speaker || "\u65C1\u767D", 26, y + 28);
          context.fillStyle = "#f5ead2";
          context.font = "15px sans-serif";
          drawWrappedText(context, page.text, 26, y + 54, width - 52, 23, 3);
          choices.forEach((choice, index) => this.button(context, `choice:${index}`, 24, y + 116 + index * 48, width - 48, 40, choice.label, index === 0 ? "primary" : "normal"));
        }
        renderPause(context, state) {
          this.renderMenu(context, state);
        }
        button(context, id, x, y, width, height, label, kind) {
          const disabled = kind.startsWith("disabled");
          const round = kind.endsWith("Round");
          context.fillStyle = disabled ? "rgba(88, 82, 70, 0.5)" : kind.startsWith("primary") ? "#8f2e23" : "rgba(50, 43, 32, 0.92)";
          context.strokeStyle = disabled ? "rgba(180,170,150,.2)" : "rgba(224, 192, 126, 0.58)";
          context.beginPath();
          if (round) context.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
          else roundedRect(context, x, y, width, height, kind === "icon" ? 5 : 6);
          context.fill();
          context.stroke();
          context.fillStyle = disabled ? "#8f8879" : "#f5ead2";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.font = kind === "icon" ? "22px sans-serif" : "700 15px sans-serif";
          context.fillText(label, x + width / 2, y + height / 2);
          context.textBaseline = "alphabetic";
          this.buttons.push({ id, x, y, width, height, disabled });
        }
        worldNode(context, node) {
          const statusColor = {
            current: "#e4bc58",
            cleared: "#75cf86",
            unlocked: "#79b8ff",
            locked: "#71695c"
          }[node.status] || "#71695c";
          context.save();
          context.beginPath();
          context.arc(node.x, node.y, node.status === "locked" ? 7 : 10, 0, Math.PI * 2);
          context.fillStyle = statusColor;
          context.fill();
          context.strokeStyle = "rgba(15, 12, 8, 0.8)";
          context.lineWidth = 3;
          context.stroke();
          context.textAlign = "center";
          context.font = "700 12px sans-serif";
          context.fillStyle = node.status === "locked" ? "rgba(224, 212, 188, 0.58)" : "#f8ebce";
          context.fillText(node.name, node.x, node.y - 18);
          context.restore();
        }
        hit(x, y) {
          return this.buttons.find((button) => !button.disabled && x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height)?.id || null;
        }
      };
      function roundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arcTo(x + width, y, x + width, y + height, radius);
        context.arcTo(x + width, y + height, x, y + height, radius);
        context.arcTo(x, y + height, x, y, radius);
        context.arcTo(x, y, x + width, y, radius);
        context.closePath();
      }
      function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
        let line = "";
        let lineNumber = 0;
        for (const char of text) {
          const candidate = line + char;
          if (context.measureText(candidate).width > maxWidth && line) {
            context.fillText(line, x, y + lineNumber * lineHeight);
            line = char;
            lineNumber += 1;
            if (lineNumber >= maxLines) return;
          } else line = candidate;
        }
        if (lineNumber < maxLines) context.fillText(line, x, y + lineNumber * lineHeight);
      }
      function drawImageCover(context, image, x, y, width, height) {
        const scale = Math.max(width / image.width, height / image.height);
        const sourceWidth = width / scale;
        const sourceHeight = height / scale;
        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = (image.height - sourceHeight) / 2;
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
      }
      function itemColor(rarity) {
        if (rarity === "\u7CBE\u826F") return "#83b9d7";
        if (rarity === "\u7A00\u6709") return "#d5b45f";
        return "#b9c28c";
      }
      module.exports = { UiRenderer };
    }
  });

  // wechat-minigame/js/battleScene.js
  var require_battleScene = __commonJS({
    "wechat-minigame/js/battleScene.js"(exports, module) {
      var { BATTLE, GAME } = require_config();
      var { drawSprite } = require_player();
      var BattleScene = class {
        constructor({ images, viewport, hitSfx, skillSfx = {}, mapKey = "battleTemple", playerModifiers = {}, unlockedSkillIds = [], onFinish }) {
          this.images = images;
          this.viewport = viewport;
          this.hitSfx = hitSfx;
          this.skillSfx = skillSfx;
          this.onFinish = onFinish;
          this.config = BATTLE;
          this.mapKey = mapKey;
          this.playerModifiers = playerModifiers;
          this.unlockedSkillIds = unlockedSkillIds;
          this.active = false;
          this.audit = { attacks: [], moves: [], enemyActions: [], animations: [], renderedAttackFrames: [], result: null };
        }
        start() {
          this.units = [...BATTLE.players, ...BATTLE.enemies].map((unit) => {
            const equipment = unit.side === "player" ? this.playerModifiers : {};
            const skillIds = unit.id === "hero" && this.unlockedSkillIds.length ? [...(unit.skillIds || []).slice(0, 2), ...this.unlockedSkillIds].slice(0, 3) : unit.skillIds;
            return {
              ...unit,
              skillIds,
              maxHp: unit.hp,
              move: unit.move + (equipment.move || 0),
              damage: unit.damage + (equipment.attack || 0),
              bonusAttack: equipment.attack || 0,
              defense: equipment.defense || 0,
              displayHp: unit.hp,
              status: {},
              moved: false,
              acted: false,
              alive: true,
              direction: unit.side === "player" ? "right" : "left",
              animation: null,
              frame: 0,
              frameTime: 0
            };
          });
          this.side = "player";
          this.phase = "move";
          this.selectedId = "hero";
          this.selectedSkillId = this.skillsFor(this.selected)[0]?.id || null;
          this.message = `${this.selected.name} \u5F85\u547D`;
          this.highlights = this.movesFor(this.selected);
          this.turnNotice = { text: "\u6211\u65B9\u56DE\u5408", time: 1.2 };
          this.active = true;
        }
        get selected() {
          return this.units.find((unit) => unit.id === this.selectedId && unit.alive);
        }
        update(dt) {
          if (!this.active) return;
          for (const unit of this.units) {
            unit.frameTime += dt;
            if (unit.frameTime > 0.16) {
              unit.frameTime = 0;
              unit.frame = (unit.frame + 1) % 4;
            }
            if (unit.animation) {
              unit.animation.time -= dt;
              if (unit.animation.time <= 0) unit.animation = null;
            }
            unit.displayHp += (unit.hp - unit.displayHp) * Math.min(1, dt * 7.5);
          }
          if (this.turnNotice) {
            this.turnNotice.time -= dt;
            if (this.turnNotice.time <= 0) this.turnNotice = null;
          }
          if (this.side === "enemy" && !this.enemyThinking) {
            this.enemyThinking = true;
            setTimeout(() => this.runEnemyTurn(), 360);
          }
        }
        render(context, ui) {
          ui.buttons = [];
          context.clearRect(0, 0, this.viewport.width, this.viewport.height);
          this.drawHeader(context, ui);
          this.drawField(context);
          this.drawPanel(context, ui);
        }
        activate(button) {
          if (this.finished) return;
          if (button === "battle:attack") return this.chooseBasicAttack();
          if (button === "battle:wait") return this.waitSelected();
          if (button === "battle:undo") return this.undoMove();
          if (button === "battle:skill" || button.startsWith("battle:skill:")) {
            if (!this.selected || this.selected.acted) return;
            const skillId = button.split(":")[2] || this.skillsFor(this.selected)[0]?.id;
            const skill = this.skillById(skillId);
            if (!skill || this.selected.qi < skill.cost) {
              this.message = "\u771F\u6C14\u4E0D\u8DB3";
              return;
            }
            this.selectedSkillId = skill.id;
            if (skill.kind === "ally_all") {
              this.castSupport(this.selected, skill);
              return;
            }
            const targets = this.targetable(this.selected, skill);
            if (!targets.length) {
              this.message = "\u76EE\u6807\u4E0D\u5728\u8303\u56F4\u5185";
              return;
            }
            this.phase = "target";
            this.highlights = targets.map((unit) => ({ x: unit.x, y: unit.y, kind: "target" }));
            this.message = `\u9009\u62E9${skill.name}\u76EE\u6807`;
          }
          if (button === "battle:end") this.endPlayerTurn();
        }
        chooseBasicAttack() {
          if (!this.selected || this.selected.acted) return;
          const skill = this.skillById("basic_attack");
          const targets = this.targetable(this.selected, skill);
          if (!targets.length) {
            this.message = "\u76F8\u90BB\u683C\u6CA1\u6709\u654C\u4EBA\uFF0C\u53EF\u79FB\u52A8\u540E\u5F85\u547D";
            return;
          }
          this.selectedSkillId = skill.id;
          this.phase = "target";
          this.highlights = targets.map((unit) => ({ x: unit.x, y: unit.y, kind: "target" }));
          this.message = "\u9009\u62E9\u666E\u901A\u653B\u51FB\u76EE\u6807";
        }
        waitSelected() {
          const unit = this.selected;
          if (!unit || unit.acted) return;
          unit.moved = true;
          unit.acted = true;
          unit.animation = { type: "wait", time: 0.24 };
          this.skillSfx.wait?.play();
          this.audit.moves.push({ id: unit.id, wait: true });
          this.message = `${unit.name} \u5F85\u547D`;
          this.phase = "select";
          this.highlights = [];
          this.selectedId = null;
          this.advanceAfterPlayerAction();
        }
        undoMove() {
          const unit = this.selected;
          if (!unit || !unit.moved || unit.acted || !unit.previousCell) return;
          unit.x = unit.previousCell.x;
          unit.y = unit.previousCell.y;
          unit.direction = unit.previousCell.direction || unit.direction;
          unit.previousCell = null;
          unit.moved = false;
          unit.animation = { type: "move", time: 0.12 };
          this.audit.moves.push({ id: unit.id, undo: true, x: unit.x, y: unit.y });
          this.phase = "move";
          this.highlights = this.movesFor(unit);
          this.message = `${unit.name} \u5DF2\u53D6\u6D88\u79FB\u52A8`;
        }
        handleTap(x, y) {
          if (this.side !== "player" || !this.active || this.finished) return;
          const cell = this.cellFromPoint(x, y);
          if (!cell) return;
          const unit = this.unitAt(cell.x, cell.y);
          if (unit?.side === "player" && !unit.acted) {
            this.selectedId = unit.id;
            this.phase = unit.moved ? "act" : "move";
            this.highlights = unit.moved ? [] : this.movesFor(unit);
            this.message = `${unit.name} \u5F85\u547D`;
            return;
          }
          if (this.phase === "move" && this.selected && this.isHighlighted(cell.x, cell.y, "move")) {
            const selected = this.selected;
            selected.previousCell = { x: selected.x, y: selected.y, direction: selected.direction };
            selected.direction = directionTo(selected, cell);
            selected.x = cell.x;
            selected.y = cell.y;
            selected.moved = true;
            selected.animation = { type: "move", time: 0.16 };
            this.audit.moves.push({ id: selected.id, x: cell.x, y: cell.y });
            this.phase = "act";
            this.highlights = [];
            this.message = "\u79FB\u52A8\u5B8C\u6210\uFF0C\u9009\u62E9\u653B\u51FB\u3001\u6280\u80FD\u6216\u5F85\u547D";
            return;
          }
          if (this.phase === "target" && this.selected && unit?.side === "enemy" && this.isHighlighted(cell.x, cell.y, "target")) {
            this.castSkill(this.selected, unit, this.skillById(this.selectedSkillId));
          }
        }
        castSkill(attacker, target, skill = this.skillsFor(attacker)[0]) {
          if (!skill || attacker.qi < skill.cost) return;
          const targets = skill.kind === "aoe" ? this.living(target.side).filter((unit) => unit.alive && distance(unit, target) <= (skill.radius || 0)) : [target];
          attacker.qi = Math.max(0, attacker.qi - skill.cost);
          attacker.direction = directionTo(attacker, target);
          for (const item of targets) this.applyDamage(attacker, item, skill);
          attacker.moved = true;
          attacker.acted = true;
          attacker.animation = { type: "attack", targetX: target.x, targetY: target.y, time: 0.36, duration: 0.36, skill };
          this.audit.animations.push({ id: attacker.id, type: "attack", sprite: attacker.attackSprite || attacker.sprite, direction: attacker.direction, frames: [0, 1, 2, 3], duration: 0.36 });
          this.playSkillSfx(skill);
          this.message = `${attacker.name} \u4F7F\u7528${skill.name}\uFF0C\u547D\u4E2D ${targets.length} \u4E2A\u76EE\u6807`;
          this.phase = "select";
          this.highlights = [];
          this.selectedId = null;
          this.checkResult();
          if (attacker.side === "player") this.advanceAfterPlayerAction();
        }
        applyDamage(attacker, target, skill) {
          target.direction = directionTo(target, attacker);
          const exposedBonus = target.status?.exposed ? 8 : 0;
          const rawDamage = (skill.damage ?? attacker.damage) + (skill.damage ? attacker.bonusAttack || 0 : 0) + exposedBonus;
          const damage = Math.max(1, rawDamage - (target.defense || 0));
          target.hp = Math.max(0, target.hp - damage);
          target.alive = target.hp > 0;
          if (skill.status) target.status[skill.status] = skill.statusTurns || 1;
          target.animation = { type: "hit", damage, time: 0.56, duration: 0.56, skill, fromHp: target.displayHp, toHp: target.hp };
          this.audit.attacks.push({ attackerId: attacker.id, targetId: target.id, skillId: skill.id, damage, targetHp: target.hp, status: skill.status || null });
        }
        castSupport(attacker, skill) {
          attacker.qi = Math.max(0, attacker.qi - skill.cost);
          const allies = this.living(attacker.side).filter((unit) => unit.alive);
          for (const ally of allies) {
            if (skill.heal) {
              ally.hp = Math.min(ally.maxHp, ally.hp + skill.heal);
              ally.animation = { type: "heal", amount: skill.heal, time: 0.48, duration: 0.48, skill };
            }
            if (skill.qiRestore) ally.qi += skill.qiRestore;
          }
          attacker.moved = true;
          attacker.acted = true;
          this.audit.attacks.push({ attackerId: attacker.id, targetId: "allies", skillId: skill.id, heal: skill.heal || 0, qiRestore: skill.qiRestore || 0 });
          this.playSkillSfx(skill);
          this.message = `${attacker.name} \u4F7F\u7528${skill.name}`;
          this.phase = "select";
          this.highlights = [];
          this.selectedId = null;
          if (attacker.side === "player") this.advanceAfterPlayerAction();
        }
        advanceAfterPlayerAction() {
          if (this.finished || this.side !== "player") return;
          const next = this.living("player").find((unit) => !unit.acted);
          if (!next) {
            this.endPlayerTurn();
            return;
          }
          this.selectedId = next.id;
          this.phase = next.moved ? "act" : "move";
          this.highlights = next.moved ? [] : this.movesFor(next);
        }
        endPlayerTurn() {
          if (this.finished) return;
          this.side = "enemy";
          this.phase = "enemy";
          this.selectedId = null;
          this.highlights = [];
          this.turnNotice = { text: "\u654C\u65B9\u56DE\u5408", time: 1.35 };
          this.message = "\u654C\u65B9\u56DE\u5408";
        }
        runEnemyTurn() {
          if (!this.active || this.finished) return;
          const enemies = this.living("enemy").filter((unit) => unit.alive);
          for (const enemy of enemies) {
            const target = nearest(enemy, this.living("player").filter((unit) => unit.alive));
            if (!target) break;
            if (enemy.status?.stunned) {
              enemy.status.stunned -= 1;
              this.message = `${enemy.name} \u88AB\u70B9\u7A74\uFF0C\u65E0\u6CD5\u884C\u52A8`;
              this.audit.enemyActions.push({ id: enemy.id, action: "stunned" });
              continue;
            }
            const skill = this.skillsFor(enemy)[0] || this.skillById("basic_attack");
            if (distance(enemy, target) > skill.range) this.moveEnemyToward(enemy, target, skill.range);
            if (distance(enemy, target) <= skill.range) this.enemyCastSkill(enemy, target, skill);
            else {
              this.message = `${enemy.name} \u6B63\u5728\u903C\u8FD1`;
              this.audit.enemyActions.push({ id: enemy.id, action: "advance", x: enemy.x, y: enemy.y });
            }
            if (this.finished) return;
          }
          for (const unit of this.units) this.tickStatus(unit);
          for (const unit of this.living("player")) {
            unit.moved = false;
            unit.acted = false;
            unit.previousCell = null;
          }
          this.side = "player";
          this.phase = "move";
          this.selectedId = this.living("player")[0]?.id || null;
          this.highlights = this.selected ? this.movesFor(this.selected) : [];
          this.turnNotice = { text: "\u6211\u65B9\u56DE\u5408", time: 1.35 };
          this.message = this.selected ? `${this.selected.name} \u884C\u52A8` : "\u6211\u65B9\u56DE\u5408";
          this.enemyThinking = false;
        }
        moveEnemyToward(enemy, target, preferredRange = 1) {
          const occupied = new Set(this.units.filter((unit) => unit.alive && unit.id !== enemy.id).map((unit) => `${unit.x},${unit.y}`));
          let best = { x: enemy.x, y: enemy.y, metric: distance(enemy, target) * 10 };
          for (let y = 0; y < BATTLE.rows; y += 1) {
            for (let x = 0; x < BATTLE.cols; x += 1) {
              const steps = distance(enemy, { x, y });
              if (steps < 1 || steps > enemy.move || occupied.has(`${x},${y}`)) continue;
              const rangeDistance = Math.abs(distance({ x, y }, target) - preferredRange);
              const metric = rangeDistance * 10 + distance({ x, y }, target);
              if (metric < best.metric) best = { x, y, metric };
            }
          }
          if (best.x === enemy.x && best.y === enemy.y) return;
          enemy.direction = directionTo(enemy, best);
          enemy.x = best.x;
          enemy.y = best.y;
          enemy.moved = true;
          enemy.animation = { type: "move", time: 0.16 };
          this.audit.enemyActions.push({ id: enemy.id, action: "move", x: enemy.x, y: enemy.y });
        }
        enemyCastSkill(enemy, target, skill) {
          if (!skill || enemy.qi < skill.cost) skill = this.skillById("basic_attack");
          enemy.qi = Math.max(0, enemy.qi - (skill.cost || 0));
          enemy.direction = directionTo(enemy, target);
          this.applyDamage(enemy, target, skill);
          enemy.moved = true;
          enemy.acted = true;
          enemy.animation = { type: "attack", targetX: target.x, targetY: target.y, time: 0.36, duration: 0.36, skill };
          this.audit.animations.push({ id: enemy.id, type: "attack", sprite: enemy.attackSprite || enemy.sprite, direction: enemy.direction, frames: [0, 1, 2, 3], duration: 0.36 });
          this.playSkillSfx(skill);
          this.message = `${enemy.name} \u653B\u51FB ${target.name}`;
          this.audit.enemyActions.push({ id: enemy.id, action: "attack", targetId: target.id, skillId: skill.id });
          this.checkResult();
        }
        checkResult() {
          if (!this.living("enemy").filter((unit) => unit.alive).length) this.scheduleFinish("victory");
          if (!this.living("player").filter((unit) => unit.alive).length) this.scheduleFinish("defeat");
        }
        scheduleFinish(result) {
          if (this.finished) return;
          this.finished = true;
          this.audit.result = result;
          this.phase = "result";
          this.highlights = [];
          this.message = result === "victory" ? "\u6218\u6597\u80DC\u5229" : "\u6211\u65B9\u8D25\u9000";
          setTimeout(() => this.finish(result), 700);
        }
        finish(result) {
          this.active = false;
          this.onFinish?.(result, this.audit);
        }
        living(side) {
          return this.units.filter((unit) => unit.side === side && (unit.alive || unit.animation));
        }
        unitAt(x, y) {
          return this.units.find((unit) => (unit.alive || unit.animation) && unit.x === x && unit.y === y);
        }
        targetable(unit, skill = this.skillsFor(unit)[0]) {
          const targetSide = unit.side === "player" ? "enemy" : "player";
          return this.living(targetSide).filter((target) => target.alive && distance(unit, target) <= skill.range);
        }
        movesFor(unit) {
          if (!unit || unit.moved) return [];
          const occupied = new Set(this.units.filter((item) => item.alive && item.id !== unit.id).map((item) => `${item.x},${item.y}`));
          const moves = [];
          for (let y = 0; y < BATTLE.rows; y += 1) {
            for (let x = 0; x < BATTLE.cols; x += 1) {
              const steps = distance(unit, { x, y });
              if (steps > 0 && !occupied.has(`${x},${y}`) && steps <= unit.move) moves.push({ x, y, kind: "move" });
            }
          }
          return moves;
        }
        isHighlighted(x, y, kind) {
          return this.highlights.some((cell) => cell.x === x && cell.y === y && cell.kind === kind);
        }
        skillsFor(unit) {
          if (!unit) return [];
          return (unit.skillIds || ["quick_slash"]).map((id) => this.skillById(id)).filter(Boolean).slice(0, 3);
        }
        skillById(id) {
          return BATTLE.skills[id] || null;
        }
        tickStatus(unit) {
          for (const [key, turns] of Object.entries(unit.status || {})) {
            if (turns <= 1) delete unit.status[key];
            else unit.status[key] = turns - 1;
          }
        }
        playSkillSfx(skill) {
          if (skill.kind === "ally_all") return this.skillSfx.heal?.play();
          if (skill.status === "stunned") return this.skillSfx.stunned?.play();
          if (skill.kind === "aoe") return this.skillSfx.aoe?.play();
          return this.hitSfx?.play();
        }
        layout() {
          const top = Math.max(112, (this.viewport.menuButton?.bottom || 44) + 76);
          const panelHeight = 236;
          const field = { x: 0, y: top, width: this.viewport.width, height: this.viewport.height - top - panelHeight };
          const tile = Math.floor(Math.min(field.width / BATTLE.cols, field.height / BATTLE.rows));
          const gridWidth = tile * BATTLE.cols;
          const gridHeight = tile * BATTLE.rows;
          return {
            field,
            tile,
            grid: {
              x: Math.round((this.viewport.width - gridWidth) / 2),
              y: Math.round(field.y + (field.height - gridHeight) / 2),
              width: gridWidth,
              height: gridHeight
            },
            panel: { x: 0, y: this.viewport.height - panelHeight, width: this.viewport.width, height: panelHeight }
          };
        }
        cellFromPoint(x, y) {
          const { grid, tile } = this.layout();
          if (x < grid.x || y < grid.y || x >= grid.x + grid.width || y >= grid.y + grid.height) return null;
          return { x: Math.floor((x - grid.x) / tile), y: Math.floor((y - grid.y) / tile) };
        }
        cellCenter(cell) {
          const { grid, tile } = this.layout();
          return { x: grid.x + cell.x * tile + tile / 2, y: grid.y + cell.y * tile + tile / 2 };
        }
        drawHeader(context, ui) {
          context.fillStyle = "rgba(25, 20, 14, 0.96)";
          const top = this.layout().field.y;
          context.fillRect(0, 0, this.viewport.width, top);
          const titleY = Math.max(42, (this.viewport.safeArea?.top || 0) + 42);
          context.textAlign = "left";
          context.fillStyle = "#f2e5c8";
          context.font = "700 20px serif";
          context.fillText(BATTLE.title, 18, titleY);
          context.font = "14px sans-serif";
          context.fillStyle = "#d8bd82";
          context.fillText(`${this.side === "player" ? "\u6211\u65B9\u56DE\u5408" : "\u654C\u65B9\u56DE\u5408"}  \xB7  ${BATTLE.objective}`, 18, titleY + 30);
          const buttonTop = Math.max(70, top - 54);
          ui.button(context, "battle:end", this.viewport.width - 112, buttonTop, 90, 42, "\u7ED3\u675F\u56DE\u5408", this.side === "player" ? "normal" : "disabled");
        }
        drawField(context) {
          const { field, grid, tile } = this.layout();
          context.save();
          context.beginPath();
          context.rect(field.x, field.y, field.width, field.height);
          context.clip();
          context.fillStyle = "#121511";
          context.fillRect(field.x, field.y, field.width, field.height);
          const background = this.images[this.mapKey] || this.images.battleTemple;
          if (background) drawImageCover(context, background, field.x, field.y, field.width, field.height);
          context.fillStyle = "rgba(8, 10, 8, 0.12)";
          context.fillRect(field.x, field.y, field.width, field.height);
          const selected = this.selected;
          if (selected) {
            context.fillStyle = "rgba(229, 190, 82, 0.26)";
            context.strokeStyle = "rgba(255, 221, 112, 0.92)";
            context.lineWidth = 3;
            context.fillRect(grid.x + selected.x * tile, grid.y + selected.y * tile, tile, tile);
            context.strokeRect(grid.x + selected.x * tile + 2, grid.y + selected.y * tile + 2, tile - 4, tile - 4);
          }
          for (const cell of this.highlights) {
            context.fillStyle = cell.kind === "target" ? "rgba(209, 48, 38, 0.40)" : "rgba(134, 224, 122, 0.34)";
            context.fillRect(grid.x + cell.x * tile, grid.y + cell.y * tile, tile, tile);
          }
          context.strokeStyle = "rgba(245, 234, 208, 0.20)";
          context.lineWidth = 1;
          for (let x = 0; x <= BATTLE.cols; x += 1) {
            context.beginPath();
            context.moveTo(grid.x + x * tile + 0.5, grid.y);
            context.lineTo(grid.x + x * tile + 0.5, grid.y + grid.height);
            context.stroke();
          }
          for (let y = 0; y <= BATTLE.rows; y += 1) {
            context.beginPath();
            context.moveTo(grid.x, grid.y + y * tile + 0.5);
            context.lineTo(grid.x + grid.width, grid.y + y * tile + 0.5);
            context.stroke();
          }
          this.drawUnits(context);
          this.drawTurnNotice(context, field);
          context.restore();
        }
        drawUnits(context) {
          const units = this.units.filter((unit) => unit.alive || unit.animation).sort((a, b) => a.y - b.y);
          for (const unit of units) {
            const center = this.cellCenter(unit);
            const hit = unit.animation?.type === "hit" ? Math.sin(unit.animation.time * 92) * 7 : 0;
            const attacking = unit.animation?.type === "attack";
            const lunge = attacking ? attackLunge(unit) : { x: 0, y: 0 };
            const alpha = unit.animation?.type === "hit" && Math.floor(unit.animation.time * 34) % 2 === 0 ? 0.32 : 1;
            const spriteKey = attacking && unit.attackSprite && this.images[unit.attackSprite] ? unit.attackSprite : unit.sprite;
            const frame = attacking ? attackAnimationFrame(unit.animation) : unit.frame;
            if (attacking && !this.audit.renderedAttackFrames.some((event) => event.id === unit.id && event.frame === frame)) {
              this.audit.renderedAttackFrames.push({ id: unit.id, sprite: spriteKey, direction: unit.direction, frame });
            }
            context.globalAlpha = alpha;
            drawSprite(context, this.images[spriteKey], center.x + hit + lunge.x, center.y + 22 + lunge.y, unit.direction, frame, 70, 70);
            context.globalAlpha = 1;
            if (unit.animation?.type === "hit") {
              context.fillStyle = "rgba(255, 246, 210, 0.35)";
              context.beginPath();
              context.arc(center.x, center.y + 2, 34, 0, Math.PI * 2);
              context.fill();
            }
            context.fillStyle = "#f5ead2";
            context.font = "12px sans-serif";
            context.textAlign = "center";
            context.fillText(unit.name, center.x, center.y - 32);
            context.fillStyle = "rgba(20, 14, 10, 0.86)";
            context.fillRect(center.x - 24, center.y + 29, 48, 5);
            context.fillStyle = unit.side === "player" ? "#65d28c" : "#e65d50";
            context.fillRect(center.x - 24, center.y + 29, 48 * Math.max(0, unit.displayHp / unit.maxHp), 5);
            if (unit.animation?.type === "hit" && unit.animation.fromHp > unit.hp) {
              const fromWidth = 48 * Math.max(0, unit.animation.fromHp / unit.maxHp);
              const toWidth = 48 * Math.max(0, unit.hp / unit.maxHp);
              context.fillStyle = "#ffd36b";
              context.fillRect(center.x - 24 + toWidth, center.y + 29, Math.max(0, fromWidth - toWidth), 5);
            }
            if (unit.status?.stunned || unit.status?.exposed) {
              context.fillStyle = unit.status.stunned ? "#ffd36b" : "#9bd1ff";
              context.font = "700 11px sans-serif";
              context.fillText(unit.status.stunned ? "\u6655" : "\u7834", center.x + 28, center.y - 22);
            }
            if (unit.animation?.type === "hit" && unit.animation.damage) {
              context.fillStyle = "#ffd36b";
              context.strokeStyle = "rgba(22, 10, 8, 0.9)";
              context.lineWidth = 3;
              context.font = "700 16px sans-serif";
              context.strokeText(`-${unit.animation.damage}`, center.x, center.y - 48);
              context.fillText(`-${unit.animation.damage}`, center.x, center.y - 48);
            }
            if (unit.animation?.type === "heal") {
              context.fillStyle = "#9dffad";
              context.font = "700 16px sans-serif";
              context.fillText(`+${unit.animation.amount}`, center.x, center.y - 48);
            }
            if (attacking && (unit.animation.skill?.kind !== "basic" || !unit.attackSprite)) this.drawAttackLine(context, unit);
          }
        }
        drawAttackLine(context, unit) {
          const from = this.cellCenter(unit);
          const to = this.cellCenter({ x: unit.animation.targetX, y: unit.animation.targetY });
          const progress = 1 - Math.max(0, unit.animation.time) / (unit.animation.duration || 0.26);
          const color = unit.animation.skill?.status === "stunned" ? "#ffd36b" : unit.animation.skill?.kind === "aoe" ? "#ff8b4a" : "#f4e6c6";
          context.strokeStyle = color;
          context.lineWidth = unit.animation.skill?.kind === "basic" ? 7 : 5;
          context.lineCap = "round";
          context.beginPath();
          const midX = from.x + (to.x - from.x) * progress;
          const midY = from.y + (to.y - from.y) * progress - 8;
          context.moveTo(from.x, from.y - 8);
          context.lineTo(midX, midY);
          context.stroke();
          context.fillStyle = "rgba(255, 236, 180, 0.28)";
          context.beginPath();
          context.arc(to.x, to.y - 8, 18 + Math.sin(progress * Math.PI) * 18, 0, Math.PI * 2);
          context.fill();
          context.lineCap = "butt";
        }
        drawTurnNotice(context, field) {
          if (!this.turnNotice) return;
          const alpha = Math.min(1, this.turnNotice.time / 0.28);
          const width = Math.min(220, this.viewport.width - 56);
          const x = (this.viewport.width - width) / 2;
          const y = field.y + 14;
          context.save();
          context.globalAlpha = alpha;
          context.fillStyle = "rgba(21, 16, 11, 0.92)";
          roundedRect(context, x, y, width, 42, 7);
          context.fill();
          context.strokeStyle = "rgba(224, 192, 126, 0.74)";
          context.stroke();
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillStyle = "#f5ead2";
          context.font = "700 17px serif";
          context.fillText(this.turnNotice.text, this.viewport.width / 2, y + 21);
          context.textBaseline = "alphabetic";
          context.restore();
        }
        drawPanel(context, ui) {
          const { panel } = this.layout();
          context.fillStyle = "rgba(21, 16, 11, 0.98)";
          context.fillRect(panel.x, panel.y, panel.width, panel.height);
          context.strokeStyle = "rgba(220, 186, 116, 0.42)";
          context.strokeRect(panel.x + 10, panel.y + 10, panel.width - 20, panel.height - 20);
          const selected = this.selected;
          context.textAlign = "left";
          context.fillStyle = "#e3c98f";
          context.font = "700 15px serif";
          context.fillText(this.message, 24, panel.y + 35);
          context.fillStyle = "#f5ead2";
          context.font = "13px sans-serif";
          const stats = selected ? `${selected.name}  HP ${selected.hp}/${selected.maxHp}  \u6C14 ${selected.qi}` : "\u70B9\u51FB\u6211\u65B9\u89D2\u8272\u9009\u62E9\u884C\u52A8";
          context.fillText(stats, 24, panel.y + 62);
          const actionDisabled = !selected || selected.acted;
          ui.button(context, "battle:attack", 24, panel.y + 78, Math.floor((panel.width - 58) / 2), 34, "\u666E\u901A\u653B\u51FB", actionDisabled ? "disabled" : "primary");
          ui.button(context, "battle:wait", panel.width / 2 + 5, panel.y + 78, Math.floor((panel.width - 58) / 2), 34, "\u5F85\u547D", actionDisabled ? "disabled" : "normal");
          if (selected?.moved && !selected.acted && selected.previousCell) {
            ui.button(context, "battle:undo", panel.width - 104, panel.y + 28, 80, 30, "\u53D6\u6D88\u79FB\u52A8", "normal");
          }
          const skills = this.skillsFor(selected);
          skills.forEach((skill, index) => {
            const y = panel.y + 120 + index * 32;
            const disabled = !selected || selected.acted || selected.qi < skill.cost;
            ui.button(context, `battle:skill:${skill.id}`, 24, y, panel.width - 48, 28, `${skill.name}  -${skill.cost}`, disabled ? "disabled" : "normal");
          });
          context.textAlign = "left";
          context.fillStyle = "rgba(246, 234, 209, 0.68)";
          context.font = "12px sans-serif";
          context.fillText("\u666E\u901A\u653B\u51FB\u4E0D\u8017\u6C14\uFF1B\u79FB\u52A8\u540E\u53EF\u653B\u51FB\u3001\u653E\u6280\u80FD\u6216\u5F85\u547D\u3002", 24, panel.y + 218);
        }
      };
      function distance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      }
      function nearest(from, units) {
        return units.slice().sort((a, b) => distance(from, a) - distance(from, b))[0] || null;
      }
      function roundedRect(context, x, y, width, height, radius) {
        context.beginPath();
        context.moveTo(x + radius, y);
        context.arcTo(x + width, y, x + width, y + height, radius);
        context.arcTo(x + width, y + height, x, y + height, radius);
        context.arcTo(x, y + height, x, y, radius);
        context.arcTo(x, y, x + width, y, radius);
        context.closePath();
      }
      function directionTo(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? "left" : "right";
        return dy < 0 ? "up" : "down";
      }
      function attackLunge(unit) {
        const progress = 1 - Math.max(0, unit.animation.time) / (unit.animation.duration || 0.26);
        const distance2 = Math.sin(Math.min(1, progress) * Math.PI) * 8;
        if (unit.direction === "left") return { x: -distance2, y: 0 };
        if (unit.direction === "right") return { x: distance2, y: 0 };
        if (unit.direction === "up") return { x: 0, y: -distance2 };
        return { x: 0, y: distance2 };
      }
      function attackAnimationFrame(animation) {
        const duration = animation.duration || 0.36;
        const progress = 1 - Math.max(0, animation.time) / duration;
        return Math.min(3, Math.floor(Math.max(0, progress) * 4));
      }
      function drawImageCover(context, image, x, y, width, height) {
        const scale = Math.max(width / image.width, height / image.height);
        const sourceWidth = width / scale;
        const sourceHeight = height / scale;
        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = (image.height - sourceHeight) / 2;
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
      }
      module.exports = { BattleScene };
    }
  });

  // wechat-minigame/js/cutscenePlayer.js
  var require_cutscenePlayer = __commonJS({
    "wechat-minigame/js/cutscenePlayer.js"(exports, module) {
      var CutscenePlayer = class {
        constructor({ viewport, source, remoteSource, playbackDurationMs = 0, fallbackDelayMs = 2400, fallbackDurationMs = 4200, onEvent, onFallback, onFinish }) {
          this.viewport = viewport;
          this.source = source;
          this.remoteSource = remoteSource;
          this.playbackDurationMs = playbackDurationMs;
          this.fallbackDelayMs = fallbackDelayMs;
          this.fallbackDurationMs = fallbackDurationMs;
          this.onEvent = onEvent;
          this.onFallback = onFallback;
          this.onFinish = onFinish;
          this.active = false;
          this.finished = false;
          this.audit = {
            source,
            resolvedSource: null,
            sourceKind: null,
            started: false,
            playEvent: false,
            timeUpdates: 0,
            fallback: false,
            result: null,
            error: null
          };
          this.loggedFirstFrame = false;
          this.logManager = wx.getLogManager ? wx.getLogManager({ level: 0 }) : null;
        }
        play() {
          if (this.active) return;
          this.active = true;
          this.audit.started = true;
          const resolvedSource = this.stageNativeSource(this.resolveSource());
          this.audit.resolvedSource = resolvedSource;
          this.audit.sourceKind = /^https?:\/\//.test(resolvedSource) ? "remote" : "package";
          this.log("create", { source: this.source, resolvedSource, sourceKind: this.audit.sourceKind });
          this.video = wx.createVideo({
            x: 0,
            y: 54,
            width: this.viewport.width,
            height: this.viewport.height - 138,
            src: resolvedSource,
            autoplay: false,
            loop: false,
            muted: true,
            controls: false,
            objectFit: "contain",
            showCenterPlayBtn: false,
            backgroundColor: "#080806"
          });
          this.audit.videoCapabilities = {
            created: Boolean(this.video),
            play: typeof this.video?.play === "function",
            onPlay: typeof this.video?.onPlay === "function",
            onTimeUpdate: typeof this.video?.onTimeUpdate === "function",
            onError: typeof this.video?.onError === "function"
          };
          this.log("created", { source: this.audit.resolvedSource, videoCapabilities: this.audit.videoCapabilities });
          this.video.onPlay?.(() => {
            this.audit.playEvent = true;
            this.log("play", { source: this.audit.resolvedSource });
          });
          this.video.onTimeUpdate?.((event) => {
            this.markFrame(event?.type || "timeupdate");
          });
          this.video.onWaiting?.(() => {
            this.audit.waitingCount = (this.audit.waitingCount || 0) + 1;
            this.log("waiting", { source: this.audit.resolvedSource, waitingCount: this.audit.waitingCount }, "warn");
          });
          this.video.onEnded?.(() => this.finish("ended"));
          this.video.onError?.((error) => {
            this.audit.error = error?.errMsg || error?.message || "video playback failed";
            this.log("error", { source: this.audit.resolvedSource, error: this.audit.error, raw: error }, "warn");
            this.startFallback("error");
          });
          this.video.show?.();
          this.video.play?.();
          this.progressPoll = setInterval(() => {
            const currentTime = Number(this.video?.currentTime || 0);
            if (currentTime > 0 && currentTime !== this.lastPolledTime) {
              this.lastPolledTime = currentTime;
              this.markFrame("currentTime-poll");
            }
          }, 200);
          if (this.isDeveloperTools()) {
            this.audit.simulatorEventBridgeUnobservable = true;
            this.log("simulator-visual-window", { source: this.audit.resolvedSource, playbackDurationMs: this.playbackDurationMs });
            this.simulatorFinishTimer = setTimeout(() => this.finish("ended"), this.playbackDurationMs || 5200);
          } else {
            this.watchdog = setTimeout(() => {
              if (this.finished || !this.active || this.audit.timeUpdates > 0) return;
              this.audit.error = this.audit.playEvent ? "video did not emit time updates" : "video did not start";
              this.log("watchdog", { source: this.audit.resolvedSource, audit: this.audit }, "warn");
              this.startFallback("watchdog");
            }, this.fallbackDelayMs);
          }
        }
        skip() {
          this.finish("skipped");
        }
        resolveSource() {
          if (this.remoteSource && !wx.__assetBase) return this.remoteSource;
          return `${wx.__assetBase || ""}${this.source}`;
        }
        stageNativeSource(source) {
          if (wx.__assetBase || /^https?:\/\//.test(source)) return source;
          const userDataPath = wx.env?.USER_DATA_PATH;
          const fileSystem = wx.getFileSystemManager?.();
          if (!userDataPath || !fileSystem?.copyFileSync) return source;
          const filename = source.split("/").pop() || "cutscene.mp4";
          const stagedSource = `${userDataPath}/${filename}`;
          try {
            try {
              fileSystem.accessSync(stagedSource);
            } catch {
              fileSystem.copyFileSync(source, stagedSource);
            }
            return stagedSource;
          } catch (error) {
            this.log("stage-error", {
              source,
              stagedSource,
              error: error?.errMsg || error?.message || "failed to stage video"
            }, "warn");
            return source;
          }
        }
        startFallback(reason) {
          if (this.finished || !this.active || this.audit.fallback) return;
          this.audit.fallback = true;
          this.audit.fallbackReason = reason;
          this.log("fallback", { reason, audit: this.audit }, "warn");
          this.destroyVideo();
          this.onFallback?.(reason, { ...this.audit });
          this.fallbackTimer = setTimeout(() => this.finish("fallback"), this.fallbackDurationMs);
        }
        destroyVideo() {
          clearInterval(this.progressPoll);
          this.video?.stop?.();
          this.video?.hide?.();
          this.video?.destroy?.();
          this.video = null;
        }
        finish(result) {
          if (this.finished) return;
          this.finished = true;
          this.active = false;
          this.audit.result = result;
          this.log("finish", { result, audit: this.audit });
          clearTimeout(this.watchdog);
          clearTimeout(this.simulatorFinishTimer);
          clearTimeout(this.fallbackTimer);
          this.destroyVideo();
          this.onFinish?.(result, { ...this.audit });
        }
        markFrame(nativeEventType) {
          this.audit.timeUpdates += 1;
          if (this.loggedFirstFrame) return;
          this.loggedFirstFrame = true;
          this.log("first-frame", { source: this.audit.resolvedSource, nativeEventType });
        }
        isDeveloperTools() {
          try {
            return wx.getSystemInfoSync?.().platform === "devtools";
          } catch {
            return false;
          }
        }
        log(event, payload = {}, level = "info") {
          const data = { event, ...payload };
          this.onEvent?.(event, { ...this.audit, payload });
          if (level === "warn") {
            console.warn?.("[cutscene]", data);
            this.logManager?.warn?.("[cutscene]", data);
          } else {
            console.info?.("[cutscene]", data);
            this.logManager?.log?.("[cutscene]", data);
          }
        }
      };
      module.exports = { CutscenePlayer };
    }
  });

  // wechat-minigame/js/cutsceneDiagnostics.js
  var require_cutsceneDiagnostics = __commonJS({
    "wechat-minigame/js/cutsceneDiagnostics.js"(exports, module) {
      var AUDIT_FILENAME = "cutscene-simulator-audit.json";
      function recordCutsceneDiagnostic(event, audit = {}) {
        const snapshot = {
          event,
          audit,
          updatedAt: Date.now()
        };
        try {
          wx.setStorageSync?.("cangshan-cutscene-audit", snapshot);
        } catch (error) {
          console.warn?.("[cutscene] failed to persist storage audit", error);
        }
        try {
          const userDataPath = wx.env?.USER_DATA_PATH;
          const fileSystem = wx.getFileSystemManager?.();
          if (!userDataPath || !fileSystem?.writeFileSync) return snapshot;
          fileSystem.writeFileSync(`${userDataPath}/${AUDIT_FILENAME}`, JSON.stringify(snapshot, null, 2), "utf8");
        } catch (error) {
          console.warn?.("[cutscene] failed to persist file audit", error);
        }
        return snapshot;
      }
      module.exports = { AUDIT_FILENAME, recordCutsceneDiagnostic };
    }
  });

  // wechat-minigame/js/cutsceneCatalog.js
  var require_cutsceneCatalog = __commonJS({
    "wechat-minigame/js/cutsceneCatalog.js"(exports, module) {
      var CUTSCENES = {
        daoistTeaching: {
          id: "daoistTeaching",
          title: "\u900D\u9065\u9053\u4EBA\u4F20\u529F",
          source: "video-pack/fuyao-teaching.mp4",
          poster: "daoistCutscenePoster",
          playbackDurationMs: 5100,
          fallbackDelayMs: 3e3,
          fallbackDurationMs: 4200,
          rewardSkillId: "fuyou_step",
          rewardSkillName: "\u6276\u6447\u8BC0"
        }
      };
      module.exports = { CUTSCENES };
    }
  });

  // wechat-minigame/js/story/daoistMasterStory.js
  var require_daoistMasterStory = __commonJS({
    "wechat-minigame/js/story/daoistMasterStory.js"(exports, module) {
      function daoistMasterDialogue({ heroName, learned, onTeach }) {
        if (learned) {
          return {
            speaker: "\u900D\u9065\u9053\u4EBA",
            text: "\u6276\u6447\u4E4B\u610F\u4E0D\u5728\u62DB\u5F0F\uFF0C\u5728\u4E58\u5929\u5730\u4E4B\u6B63\u3001\u5FA1\u516D\u6C14\u4E4B\u8FA9\u3002\u53BB\u98CE\u91CC\u518D\u8D70\u4E00\u906D\u5427\u3002"
          };
        }
        return [
          {
            speaker: "\u900D\u9065\u9053\u4EBA",
            text: "\u5317\u51A5\u6709\u9C7C\uFF0C\u5316\u800C\u4E3A\u9E4F\u3002\u5C11\u4FA0\u811A\u4E0B\u62D8\u4E8E\u5F62\uFF0C\u5FC3\u4E2D\u5374\u8FD8\u6709\u4E00\u7EBF\u6E05\u98CE\u3002"
          },
          {
            speaker: heroName,
            text: "\u524D\u8F88\u77E5\u9053\u6211\u4E3A\u4F55\u800C\u6765\uFF1F\u8FD8\u8BF7\u6307\u70B9\u8FD9\u6761\u82CD\u5C71\u65E7\u9053\u3002"
          },
          {
            speaker: "\u900D\u9065\u9053\u4EBA",
            text: "\u5148\u4E0D\u95EE\u6765\u5904\u3002\u770B\u6E05\u8FD9\u4E00\u5F0F\u6276\u6447\uFF0C\u518D\u51B3\u5B9A\u4F60\u7684\u6C5F\u6E56\u8981\u5F80\u4F55\u65B9\u3002",
            choices: [
              { label: "\u8BF7\u524D\u8F88\u4F20\u6388\u6276\u6447\u8BC0", action: onTeach },
              { label: "\u6539\u65E5\u518D\u6765" }
            ]
          }
        ];
      }
      module.exports = { daoistMasterDialogue };
    }
  });

  // wechat-minigame/js/itemCatalog.js
  var require_itemCatalog = __commonJS({
    "wechat-minigame/js/itemCatalog.js"(exports, module) {
      var ITEM_CATALOG = {
        hemostatic_powder: {
          id: "hemostatic_powder",
          name: "\u6B62\u8840\u6563",
          type: "\u836F\u54C1",
          rarity: "\u5E38\u89C1",
          effect: "\u6062\u590D\u5C11\u91CF\u6C14\u8840",
          description: "\u6C5F\u6E56\u5E38\u5907\u5916\u4F24\u836F\uFF0C\u6218\u540E\u6B62\u8840\u6700\u7A33\u59A5\u3002"
        },
        qingxin_pill: {
          id: "qingxin_pill",
          name: "\u6E05\u5FC3\u4E38",
          type: "\u836F\u54C1",
          rarity: "\u5E38\u89C1",
          effect: "\u6062\u590D\u5C11\u91CF\u771F\u6C14",
          description: "\u8584\u8377\u4E0E\u6C89\u9999\u8C03\u6210\uFF0C\u53EF\u7F13\u89E3\u8FF7\u9999\u548C\u5185\u606F\u7D0A\u4E71\u3002"
        },
        iron_sword: {
          id: "iron_sword",
          name: "\u9752\u950B\u5251",
          type: "\u6B66\u5668",
          rarity: "\u5E38\u89C1",
          effect: "\u653B\u51FB +6",
          description: "\u950B\u53E3\u5E72\u51C0\u7684\u94C1\u5251\uFF0C\u9002\u5408\u521D\u5165\u6C5F\u6E56\u8005\u3002",
          equip: { attack: 6 }
        },
        steel_saber: {
          id: "steel_saber",
          name: "\u96C1\u7FCE\u5200",
          type: "\u6B66\u5668",
          rarity: "\u7CBE\u826F",
          effect: "\u653B\u51FB +9",
          description: "\u5200\u8EAB\u7565\u5F2F\uFF0C\u5288\u65A9\u6709\u529B\u3002",
          equip: { attack: 9 }
        },
        swift_boots: {
          id: "swift_boots",
          name: "\u8E0F\u4E91\u5C65",
          type: "\u88C5\u5907",
          rarity: "\u7CBE\u826F",
          effect: "\u79FB\u52A8 +1",
          description: "\u8F7B\u4FBF\u8F6F\u5E95\u9774\uFF0C\u8D70\u5C71\u9053\u65F6\u66F4\u7701\u529B\u3002",
          equip: { move: 1 }
        },
        leather_armor: {
          id: "leather_armor",
          name: "\u8F6F\u9CDE\u7532",
          type: "\u88C5\u5907",
          rarity: "\u7CBE\u826F",
          effect: "\u9632\u5FA1 +5",
          description: "\u8584\u7532\u8D34\u8EAB\uFF0C\u80FD\u5378\u53BB\u4E00\u90E8\u5206\u5200\u5251\u529B\u9053\u3002",
          equip: { defense: 5 }
        },
        scout_token: {
          id: "scout_token",
          name: "\u5BC6\u63A2\u4EE4\u724C",
          type: "\u5267\u60C5",
          rarity: "\u7CBE\u826F",
          effect: "\u5267\u60C5\u7EBF\u7D22",
          description: "\u6697\u54E8\u8EAB\u4E0A\u641C\u51FA\u7684\u4EE4\u724C\uFF0C\u53EF\u8BC1\u660E\u897F\u5CAD\u95E8\u6F5C\u5165\u5927\u7406\u3002"
        },
        silver_piece: {
          id: "silver_piece",
          name: "\u788E\u94F6",
          type: "\u8D22\u7269",
          rarity: "\u5E38\u89C1",
          effect: "\u53EF\u6298\u7B97\u94F6\u4E24",
          description: "\u67DC\u4E2D\u627E\u5230\u7684\u5C0F\u5757\u788E\u94F6\u3002"
        },
        unsigned_letter: {
          id: "unsigned_letter",
          name: "\u65E0\u540D\u4FE1",
          type: "\u5267\u60C5",
          rarity: "\u5E38\u89C1",
          effect: "\u5267\u60C5\u7EBF\u7D22",
          description: "\u6CA1\u6709\u7F72\u540D\u7684\u77ED\u7B3A\uFF0C\u63D0\u5230\u4E86\u706F\u4EAD\u548C\u94DC\u5323\u3002"
        }
      };
      var SHOP_CATALOG = {
        apothecary: {
          id: "apothecary",
          name: "\u767E\u8349\u94FA",
          keeper: "\u836F\u644A\u8001\u4EBA",
          stock: [
            { itemId: "hemostatic_powder", price: 18 },
            { itemId: "qingxin_pill", price: 22 },
            { itemId: "iron_sword", price: 120, limit: 1 },
            { itemId: "steel_saber", price: 160, limit: 1 },
            { itemId: "swift_boots", price: 140, limit: 1 },
            { itemId: "leather_armor", price: 150, limit: 1 }
          ]
        }
      };
      function itemById(id) {
        return ITEM_CATALOG[id] || {
          id,
          name: id,
          type: "\u672A\u77E5",
          rarity: "\u5E38\u89C1",
          effect: "\u672A\u914D\u7F6E",
          description: "\u8FD9\u4E2A\u7269\u54C1\u8FD8\u6CA1\u6709\u914D\u7F6E\u8BF4\u660E\u3002"
        };
      }
      function shopById(id) {
        return SHOP_CATALOG[id] || null;
      }
      function inventoryEntries(items) {
        return Object.entries(items || {}).filter(([, amount]) => amount > 0).map(([itemId, amount]) => ({ item: itemById(itemId), amount }));
      }
      function shopEntries(shopId, items) {
        const shop = shopById(shopId);
        return (shop?.stock || []).map((entry) => {
          const item = itemById(entry.itemId);
          return {
            ...entry,
            item,
            owned: (items || {})[entry.itemId] || 0
          };
        });
      }
      function equipmentModifiers(items) {
        const modifiers = { attack: 0, move: 0, defense: 0 };
        for (const [itemId, amount] of Object.entries(items || {})) {
          if (amount <= 0) continue;
          const equip = itemById(itemId).equip;
          if (!equip) continue;
          modifiers.attack += equip.attack || 0;
          modifiers.move += equip.move || 0;
          modifiers.defense += equip.defense || 0;
        }
        return modifiers;
      }
      module.exports = { ITEM_CATALOG, SHOP_CATALOG, itemById, shopById, inventoryEntries, shopEntries, equipmentModifiers };
    }
  });

  // wechat-minigame/js/gameApp.js
  var require_gameApp = __commonJS({
    "wechat-minigame/js/gameApp.js"(exports, module) {
      var { GAME, ASSETS, BATTLE, SCOUT_IDS, WORLD_NODES } = require_config();
      var { createSurface, loadImage, createAudio, createSfx, loadAssetPacks, readSave, writeSave } = require_platform();
      var { Player, drawSprite } = require_player();
      var { MapManager } = require_mapManager();
      var { DialogSystem } = require_dialogSystem();
      var { UiRenderer } = require_uiRenderer();
      var { BattleScene } = require_battleScene();
      var { CutscenePlayer } = require_cutscenePlayer();
      var { recordCutsceneDiagnostic } = require_cutsceneDiagnostics();
      var { CUTSCENES } = require_cutsceneCatalog();
      var { daoistMasterDialogue } = require_daoistMasterStory();
      var { inventoryEntries, itemById, shopById, shopEntries, equipmentModifiers } = require_itemCatalog();
      var SAVE_KEY = "cangshan-rpg-save-v1";
      var GameApp = class {
        constructor() {
          const surface = createSurface();
          this.canvas = surface.canvas;
          this.context = surface.context;
          this.viewport = surface.viewport;
          this.ui = new UiRenderer(this.viewport);
          this.dialog = new DialogSystem();
          this.images = {};
          this.mode = "menu";
          this.musicEnabled = true;
          this.money = 120;
          this.items = {};
          this.defeatedScouts = /* @__PURE__ */ new Set();
          this.learnedSkills = /* @__PURE__ */ new Set();
          this.seenCutscenes = /* @__PURE__ */ new Set();
          this.storyFlags = /* @__PURE__ */ new Set();
          this.storyLog = [];
          this.cutsceneFallback = null;
          this.cutsceneDebug = null;
          this.currentBattleTriggerId = null;
          this.worldMapUnlocked = false;
          this.activeShopId = null;
          this.shopMessage = "";
          this.shopNotice = null;
          this.menuCanResume = false;
          this.menuNotice = "";
          this.lastPromptTriggerId = null;
          this.lastShopAudit = null;
          this.axis = { x: 0, y: 0 };
          this.lastTime = Date.now();
          this.touchBindings = /* @__PURE__ */ new Map();
          this.requestFrame = typeof requestAnimationFrame === "function" ? (callback) => requestAnimationFrame(callback) : (callback) => setTimeout(callback, 16);
        }
        async start() {
          this.loadingSet("\u52A0\u8F7D\u8D44\u6E90\u5206\u5305", "\u51C6\u5907\u5730\u56FE\u3001\u89D2\u8272\u3001\u97F3\u9891\u548C\u5267\u60C5\u52A8\u753B\u3002", 0.1);
          await loadAssetPacks();
          this.loadingSet("\u52A0\u8F7D\u56FE\u7247\u8D44\u6E90", "\u5F00\u59CB\u8BFB\u53D6\u5730\u56FE\u548C\u89D2\u8272\u56FE\u50CF\u3002", 0.25);
          await this.loadAssets();
          this.loadingSet("\u521D\u59CB\u5316\u6E38\u620F\u4E16\u754C", "\u521B\u5EFA\u5730\u56FE\u3001\u89D2\u8272\u3001\u5267\u60C5\u548C\u97F3\u9891\u7CFB\u7EDF\u3002", 0.9);
          this.mapManager = new MapManager(this.images, this.viewport);
          this.player = new Player(this.images.hero, this.mapManager.map.spawn);
          this.audio = createAudio(ASSETS.bgm);
          this.battleAudio = createAudio(ASSETS.battleBgm);
          this.hitSfx = createSfx(ASSETS.hitSfx);
          this.skillSfx = {
            stunned: createSfx(ASSETS.stunSfx),
            heal: createSfx(ASSETS.healSfx),
            aoe: createSfx(ASSETS.sweepSfx),
            wait: createSfx(ASSETS.waitSfx)
          };
          this.uiSfx = createSfx(ASSETS.uiSfx);
          this.promptSfx = createSfx(ASSETS.promptSfx);
          this.buySfx = createSfx(ASSETS.buySfx);
          this.bindTouch();
          this.loadingSet("\u51C6\u5907\u8FDB\u5165\u6C5F\u6E56", "\u6B63\u5728\u7ED8\u5236\u7B2C\u4E00\u5E27\u3002", 0.96);
          this.frame();
          globalThis.__cangshanLoading?.done?.();
        }
        async loadAssets() {
          const entries = Object.entries(ASSETS).filter(([key]) => !key.endsWith("Sfx") && !key.endsWith("Bgm") && key !== "bgm");
          let loaded = 0;
          this.loadingSet("\u52A0\u8F7D\u56FE\u7247\u8D44\u6E90", `0/${entries.length} \u5E76\u884C\u4E0B\u8F7D\u5730\u56FE\u4E0E\u89D2\u8272\u8D44\u6E90\u3002`, 0.25);
          await Promise.all(entries.map(async ([key, source]) => {
            this.images[key] = await loadImage(this.canvas, source);
            loaded += 1;
            this.loadingSet("\u52A0\u8F7D\u56FE\u7247\u8D44\u6E90", `${loaded}/${entries.length} ${source}`, 0.25 + loaded / entries.length * 0.62);
          }));
        }
        loadingSet(stage, detail, progress) {
          globalThis.__cangshanLoading?.set?.(stage, detail, progress);
        }
        frame() {
          const now = Date.now();
          const dt = Math.min(0.034, (now - this.lastTime) / 1e3);
          this.lastTime = now;
          this.update(dt);
          this.render();
          this.requestFrame(() => this.frame());
        }
        update(dt) {
          if (this.mode === "battle") {
            this.battle.update(dt);
            return;
          }
          if (this.shopNotice) {
            this.shopNotice.time -= dt;
            if (this.shopNotice.time <= 0) this.shopNotice = null;
          }
          if (this.mode !== "game" || this.dialog.active) return;
          this.player.update(dt, this.axis, (bounds) => this.mapManager.canMove(bounds));
          const previousTriggerId = this.activeTrigger?.id || null;
          this.activeTrigger = this.resolveActiveTrigger();
          this.maybePlayPromptSfx(previousTriggerId, this.activeTrigger?.id || null);
        }
        render() {
          const ctx = this.context;
          ctx.clearRect(0, 0, this.viewport.width, this.viewport.height);
          if (this.mode === "game") {
            const camera = this.mapManager.cameraFor(this.player, this.ui.playRect);
            this.mapManager.draw(ctx, camera, this.ui.playRect);
            ctx.save();
            ctx.beginPath();
            ctx.rect(this.ui.playRect.x, this.ui.playRect.y, this.ui.playRect.width, this.ui.playRect.height);
            ctx.clip();
            ctx.translate(this.ui.playRect.x, this.ui.playRect.y);
            for (const npc of this.visibleNpcs()) {
              drawSprite(ctx, this.images[npc.sprite], npc.x - camera.x, npc.y - camera.y, npc.direction, 0, 96, 96);
              ctx.textAlign = "center";
              ctx.font = "700 12px sans-serif";
              ctx.lineWidth = 3;
              ctx.strokeStyle = "rgba(20, 14, 8, 0.86)";
              ctx.strokeText(npc.name, npc.x - camera.x, npc.y - camera.y + 14);
              ctx.fillStyle = "#fff6dd";
              ctx.fillText(npc.name, npc.x - camera.x, npc.y - camera.y + 14);
            }
            this.player.draw(ctx, camera);
            ctx.restore();
            if (this.debugMap) this.mapManager.drawDebug(ctx, camera, this.ui.playRect);
          }
          if (this.mode === "worldmap") return this.ui.renderWorldMap(ctx, {
            images: this.images,
            nodes: this.worldNodes(),
            cleared: this.defeatedScouts.size,
            total: SCOUT_IDS.length
          });
          if (this.mode === "inventory") return this.ui.renderInventory(ctx, {
            money: this.money,
            entries: inventoryEntries(this.items)
          });
          if (this.mode === "shop") return this.ui.renderShop(ctx, {
            money: this.money,
            shop: shopById(this.activeShopId),
            entries: shopEntries(this.activeShopId, this.items),
            message: this.shopMessage,
            notice: this.shopNotice
          });
          if (this.mode === "battle") return this.battle.render(ctx, this.ui);
          if (this.mode === "cutscene") return this.ui.renderCutscene(ctx, {
            title: this.activeCutscene?.title,
            fallback: this.cutsceneFallback,
            debug: this.cutsceneDebug,
            images: this.images
          });
          this.ui.render(ctx, {
            mode: this.mode,
            dialog: this.dialog,
            activeTrigger: this.activeTrigger,
            images: this.images,
            musicEnabled: this.musicEnabled,
            money: this.money,
            worldMapUnlocked: this.worldMapUnlocked || this.defeatedScouts.size > 0,
            defeatedScouts: this.defeatedScouts.size,
            totalScouts: SCOUT_IDS.length,
            hasSave: Boolean(readSave(SAVE_KEY)),
            canResume: this.menuCanResume,
            menuNotice: this.menuNotice
          });
        }
        bindTouch() {
          wx.onTouchStart((event) => this.handleTouches(event.changedTouches, true));
          wx.onTouchMove((event) => this.handleTouches(event.changedTouches, true));
          wx.onTouchEnd((event) => this.handleTouches(event.changedTouches, false));
          if (wx.onTouchCancel) wx.onTouchCancel((event) => this.handleTouches(event.changedTouches, false));
        }
        handleTouches(touches, pressed) {
          for (const touch of touches || []) {
            const id = touch.identifier ?? 0;
            if (!pressed) {
              this.touchBindings.delete(id);
              continue;
            }
            const button = this.ui.hit(touch.clientX ?? touch.x, touch.clientY ?? touch.y);
            if (this.mode === "battle" && pressed && !button) this.battle.handleTap(touch.clientX ?? touch.x, touch.clientY ?? touch.y);
            const previous = this.touchBindings.get(id);
            this.touchBindings.set(id, button);
            if (button && button !== previous) this.activate(button);
          }
          const directions = [...this.touchBindings.values()];
          this.axis.x = (directions.includes("right") ? 1 : 0) - (directions.includes("left") ? 1 : 0);
          this.axis.y = (directions.includes("down") ? 1 : 0) - (directions.includes("up") ? 1 : 0);
        }
        activate(button) {
          if (this.shouldClickSfx(button)) this.uiSfx?.play();
          if (button === "new") return this.newGame();
          if (button === "continue") return this.loadGame();
          if (button === "resume") return this.closeMenu();
          if (button === "save") return this.saveGame();
          if (button === "music") return this.toggleMusic();
          if (button === "menu") return this.openMenu();
          if (button === "inventory") return this.openInventory();
          if (button === "closeInventory") return this.closeInventory();
          if (button === "closeShop") return this.closeShop();
          if (button.startsWith("shop:buy:")) return this.buyItem(button.split(":")[2]);
          if (button === "worldmap") return this.openWorldMap();
          if (button === "closeWorldMap") return this.closeWorldMap();
          if (button === "interact") return this.interact();
          if (button.startsWith("battle:")) return this.battle?.activate(button);
          if (button === "cutscene:skip") return this.cutscene?.skip();
          if (button.startsWith("choice:")) return this.dialog.advance(Number(button.split(":")[1]));
        }
        newGame() {
          this.menuCanResume = false;
          this.menuNotice = "";
          this.mode = "game";
          this.money = 120;
          this.items = { hemostatic_powder: 2, qingxin_pill: 1 };
          this.defeatedScouts = /* @__PURE__ */ new Set();
          this.learnedSkills = /* @__PURE__ */ new Set();
          this.seenCutscenes = /* @__PURE__ */ new Set();
          this.storyFlags = /* @__PURE__ */ new Set();
          this.storyLog = [];
          this.currentBattleTriggerId = null;
          this.worldMapUnlocked = false;
          this.activeShopId = null;
          this.shopMessage = "";
          this.shopNotice = null;
          this.lastShopAudit = null;
          this.enterMap("world");
          this.playMusic();
          this.dialog.show([
            { speaker: GAME.companionName, text: "\u4F60\u7EC8\u4E8E\u9192\u4E86\u3002\u6628\u591C\u82CD\u5C71\u949F\u58F0\u5FFD\u65AD\uFF0C\u5BA2\u6808\u5916\u53C8\u591A\u4E86\u51E0\u540D\u964C\u751F\u4EBA\u3002" },
            { speaker: GAME.heroName, text: "\u6211\u7684\u4F69\u5251\u4E0D\u89C1\u4E86\uFF0C\u53EA\u8BB0\u5F97\u660F\u8FF7\u524D\u542C\u89C1\u4E00\u9635\u77ED\u7B1B\u3002" },
            { speaker: GAME.companionName, text: "\u5148\u53BB\u5BA2\u6808\u5185\u5BA4\u67E5\u627E\u8D26\u518C\u3002\u9760\u8FD1\u6728\u95E8\u540E\uFF0C\u70B9\u53F3\u4E0B\u89D2\u7684\u201C\u4EA4\u4E92\u201D\u3002" }
          ]);
        }
        openMenu() {
          this.menuCanResume = this.mode === "game";
          this.menuNotice = "";
          this.mode = "menu";
          this.axis = { x: 0, y: 0 };
        }
        closeMenu() {
          if (!this.menuCanResume) return;
          this.mode = "game";
          this.menuNotice = "";
          this.playMusic();
        }
        interact() {
          const trigger = this.activeTrigger;
          if (!trigger) return;
          if (trigger.id === "inn") {
            this.dialog.show({ speaker: "\u4E91\u6765\u5BA2\u6808", text: "\u6728\u95E8\u865A\u63A9\uFF0C\u5C4B\u91CC\u4F20\u6765\u6DE1\u6DE1\u836F\u9999\u3002", choices: [
              { label: "\u8FDB\u5165\u5BA2\u623F", action: () => this.enterRoom("room") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "apothecaryDoor") {
            this.dialog.show({ speaker: "\u767E\u8349\u94FA", text: "\u67DC\u53F0\u540E\u8349\u836F\u6210\u6392\uFF0C\u836F\u9999\u76D6\u8FC7\u4E86\u95E8\u5916\u5C71\u98CE\u3002", choices: [
              { label: "\u8FDB\u5165\u767E\u8349\u94FA", action: () => this.enterRoom("apothecaryRoom") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "teahouseDoor") {
            this.dialog.show({ speaker: "\u677E\u98CE\u8336\u8086", text: "\u7AF9\u5E18\u534A\u5377\uFF0C\u91CC\u9762\u6709\u4EBA\u4F4E\u58F0\u8C08\u8D77\u897F\u5CAD\u5BC6\u63A2\u7684\u53BB\u5411\u3002", choices: [
              { label: "\u8FDB\u5165\u8336\u8086", action: () => this.enterRoom("teahouseRoom") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "moonValleyGate") {
            this.dialog.show({ speaker: "\u6708\u534E\u8C37\u5C71\u53E3", text: "\u96FE\u6C14\u4ECE\u7AF9\u6797\u6DF1\u5904\u6D8C\u51FA\uFF0C\u77F3\u9636\u5C3D\u5934\u9690\u7EA6\u6709\u706F\u706B\u3002", choices: [
              { label: "\u8FDB\u5165\u6708\u534E\u8C37", action: () => this.enterMap("moonValley") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "moonValleyExit") {
            this.dialog.show({ speaker: "\u6708\u534E\u8C37\u5C71\u95E8", text: "\u5C71\u98CE\u4ECE\u8C37\u53E3\u5439\u56DE\u65E7\u9053\u3002\u8981\u79BB\u5F00\u6708\u534E\u8C37\u5417\uFF1F", choices: [
              { label: "\u8FD4\u56DE\u82CD\u5C71\u65E7\u9053", action: () => this.enterMap("world", this.mapManager.map.exitTo?.spawn) },
              { label: "\u7EE7\u7EED\u63A2\u7D22" }
            ] });
          } else if (trigger.id === "moonMedicineDoor") {
            this.dialog.show({ speaker: "\u6708\u534E\u836F\u5E90", text: "\u836F\u9999\u900F\u8FC7\u95E8\u7F1D\u6563\u51FA\uFF0C\u91CC\u9762\u6709\u4EBA\u6B63\u5728\u7814\u78E8\u8349\u836F\u3002", choices: [
              { label: "\u8FDB\u5165\u836F\u5E90", action: () => this.enterRoom("moonMedicineHall") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "moonStudyDoor") {
            this.dialog.show({ speaker: "\u6708\u534E\u4E66\u623F", text: "\u7A97\u5185\u706F\u5F71\u672A\u706D\uFF0C\u6848\u4E0A\u4F3C\u4E4E\u644A\u7740\u4E00\u5377\u6B8B\u56FE\u3002", choices: [
              { label: "\u8FDB\u5165\u4E66\u623F", action: () => this.enterRoom("moonStudy") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "roomExit") {
            const exit = this.mapManager.map.exitTo || { mapId: "world", spawn: { x: 2700, y: 2520 }, label: "\u79BB\u5F00\u623F\u95F4" };
            this.dialog.show({ speaker: "\u95E8\u53E3", text: "\u8981\u56DE\u5230\u82CD\u5C71\u65E7\u9053\u5417\uFF1F", choices: [
              { label: exit.label, action: () => this.enterMap(exit.mapId, exit.spawn) },
              { label: "\u7EE7\u7EED\u641C\u7D22" }
            ] });
          } else if (trigger.id === "wardrobe") {
            this.addItem("silver_piece", 1);
            this.addItem("unsigned_letter", 1);
            this.money += 12;
            this.dialog.show({ speaker: "\u6728\u67DC", text: "\u67DC\u95E8\u5431\u5440\u6253\u5F00\u3002\u65E7\u5E03\u56CA\u91CC\u6709\u788E\u94F6\u548C\u4E00\u5C01\u672A\u7F72\u540D\u7684\u4FE1\u3002\u5DF2\u653E\u5165\u80CC\u5305\u3002", choices: [{ label: "\u6536\u4E0B\u7EBF\u7D22" }] });
          } else if (trigger.id === "desk") {
            this.dialog.show({ speaker: "\u8D26\u518C", text: "\u5939\u9875\u53CD\u590D\u5199\u7740\u201C\u706F\u4EAD\u3001\u94DC\u5323\u3001\u5BFA\u540E\u201D\uFF0C\u4E09\u5904\u4F3C\u4E4E\u6307\u5411\u540C\u4E00\u6761\u5BC6\u9053\u3002" });
          } else if (trigger.id === "vendor") {
            this.dialog.show({ speaker: "\u836F\u644A\u8001\u4EBA", text: "\u5C11\u4FA0\u6C14\u606F\u4E0D\u7A33\u3002\u82E5\u8981\u8865\u836F\u6216\u5175\u5203\uFF0C\u6211\u8FD9\u644A\u4E0A\u8FD8\u6709\u51E0\u6837\u53EF\u7528\u3002", choices: [
              { label: "\u67E5\u770B\u8D27\u7269", action: () => this.openShop("apothecary") },
              { label: "\u6682\u65F6\u79BB\u5F00" }
            ] });
          } else if (trigger.id === "daoist_master") {
            this.dialog.show(daoistMasterDialogue({
              heroName: GAME.heroName,
              learned: this.learnedSkills.has("fuyou_step"),
              onTeach: () => this.playCutscene("daoistTeaching")
            }));
          } else if (trigger.id === "qin_wanyao") {
            const invited = this.items.palace_invitation > 0;
            this.dialog.show({
              speaker: "\u79E6\u665A\u7476",
              text: invited ? "\u8BF7\u5E16\u5DF2\u7ECF\u4EA4\u7ED9\u4F60\u3002\u8FDB\u738B\u5E9C\u4EE5\u540E\uFF0C\u542C\u5230\u4EC0\u4E48\u90FD\u4E0D\u8981\u7ACB\u523B\u76F8\u4FE1\uFF0C\u5C24\u5176\u662F\u5173\u4E8E\u4E0A\u4E00\u4EE3\u4EBA\u7684\u6E05\u767D\u3002" : "\u8C37\u4E2D\u836F\u8D26\u88AB\u4EBA\u6539\u8FC7\uFF0C\u5C11\u4FA0\u82E5\u8981\u8FFD\u67E5\u65E7\u6848\uFF0C\u5148\u4ECE\u4E66\u623F\u6B8B\u56FE\u770B\u8D77\u3002\u8FD9\u5C01\u738B\u5E9C\u8BF7\u5E16\uFF0C\u4E5F\u8BB8\u80FD\u8BA9\u4F60\u95EE\u5230\u66F4\u6DF1\u7684\u771F\u76F8\u3002",
              choices: invited ? [
                { label: "\u8BB0\u4E0B\u63D0\u9192" },
                { label: "\u8BF7\u5979\u914D\u4E9B\u4F24\u836F", action: () => this.openShop("apothecary") }
              ] : [
                { label: "\u6536\u4E0B\u738B\u5E9C\u8BF7\u5E16", action: () => this.acceptPalaceInvitation() },
                { label: "\u8BF7\u5979\u914D\u4E9B\u4F24\u836F", action: () => this.openShop("apothecary") }
              ]
            });
          } else if (trigger.id === "mu_zhiyan") {
            const heard = this.storyFlags.has("heard_swapped_children_clue");
            this.dialog.show({
              speaker: "\u7A46\u82B7\u70DF",
              text: heard ? "\u6211\u8BF4\u8FC7\u4E86\uFF0C\u88AB\u8C03\u5305\u7684\u5B69\u5B50\u4E0D\u6B62\u4E00\u4E2A\u3002\u4F60\u82E5\u53EA\u76EF\u7740\u81EA\u5DF1\u7684\u8EAB\u4E16\uFF0C\u5C31\u4F1A\u6F0F\u6389\u771F\u6B63\u4E0B\u68CB\u7684\u4EBA\u3002" : "\u6628\u591C\u6709\u4EBA\u4ECE\u6865\u540E\u7FFB\u5165\u836F\u5703\uFF0C\u53EA\u7559\u4E0B\u534A\u679A\u9752\u94DC\u6263\u3002\u90A3\u4EBA\u5E94\u8FD8\u85CF\u5728\u8C37\u4E2D\u3002\u88AB\u8C03\u5305\u7684\u5B69\u5B50\uFF0C\u4E5F\u8BB8\u4E0D\u6B62\u4F60\u4EE5\u4E3A\u7684\u90A3\u4E00\u4E2A\u3002",
              choices: [
                { label: "\u8BB0\u4E0B\u8C03\u5305\u7EBF\u7D22", action: () => this.rememberMoonClue() },
                { label: "\u6682\u65F6\u79BB\u5F00" }
              ]
            });
          } else if (trigger.id === "moon_disciple") {
            if (!this.storyFlags.has("moon_disciple_gift_taken")) {
              this.storyFlags.add("moon_disciple_gift_taken");
              this.addItem("qingxin_pill", 1);
              this.rememberStory("\u6708\u534E\u5F1F\u5B50\u8D60\u4E88\u6E05\u5FC3\u4E38\uFF0C\u5E76\u63D0\u9192\u8C37\u4E2D\u53DB\u5F92\u85CF\u5728\u6865\u540E\u3002");
              this.dialog.show({ speaker: "\u6708\u534E\u5F1F\u5B50", text: "\u5E08\u59D0\u5429\u5490\u6211\u5728\u6B64\u7B49\u4F60\u3002\u8FD9\u679A\u6E05\u5FC3\u4E38\u53EF\u7A33\u4F4F\u771F\u6C14\uFF0C\u6865\u540E\u7684\u53DB\u5F92\u4E5F\u8BB8\u6B63\u7B49\u7740\u4F60\u3002", choices: [{ label: "\u6536\u4E0B" }] });
            } else {
              this.dialog.show({ speaker: "\u6708\u534E\u5F1F\u5B50", text: "\u6865\u540E\u90A3\u4EBA\u4E0D\u662F\u8C37\u91CC\u5F1F\u5B50\u3002\u4ED6\u6765\u5F97\u5F88\u6025\uFF0C\u50CF\u662F\u6015\u4F60\u627E\u5230\u4E66\u623F\u91CC\u7684\u6B8B\u56FE\u3002", choices: [{ label: "\u8BB0\u4E0B" }] });
            }
          } else if (trigger.id.startsWith("scout")) {
            const speaker = trigger.id === "scout_moon" ? "\u8C37\u4E2D\u53DB\u5F92" : "\u897F\u5CAD\u5BC6\u63A2";
            const text = trigger.id === "scout_moon" ? "\u4F60\u4E0D\u8BE5\u6765\u6708\u534E\u8C37\u3002\u6B8B\u56FE\u548C\u836F\u8D26\uFF0C\u90FD\u5F97\u7559\u5728\u8FD9\u91CC\u3002" : "\u524D\u8DEF\u5C01\u4E86\u3002\u82E5\u518D\u5411\u524D\u4E00\u6B65\uFF0C\u5200\u5251\u65E0\u773C\u3002";
            this.dialog.show({ speaker, text, choices: [
              { label: "\u62D4\u5251\u8FCE\u6218", action: () => this.startBattle(trigger.id) },
              { label: "\u6682\u907F\u950B\u8292" }
            ] });
          }
        }
        startBattle(triggerId) {
          this.axis = { x: 0, y: 0 };
          this.touchBindings.clear();
          this.currentBattleTriggerId = triggerId;
          this.battle = new BattleScene({
            images: this.images,
            viewport: this.viewport,
            hitSfx: this.hitSfx,
            skillSfx: this.skillSfx,
            mapKey: this.battleMapFor(triggerId),
            playerModifiers: equipmentModifiers(this.items),
            unlockedSkillIds: [...this.learnedSkills],
            onFinish: (result, audit) => {
              const rewards = result === "victory" ? this.grantBattleRewards() : { money: 0, items: [] };
              if (result === "victory" && this.currentBattleTriggerId) this.defeatedScouts.add(this.currentBattleTriggerId);
              this.worldMapUnlocked = this.requiredScoutDefeatCount() >= SCOUT_IDS.length;
              this.lastBattleAudit = { ...audit, rewards };
              this.mode = "game";
              this.playMusic();
              this.activeTrigger = this.resolveActiveTrigger();
              const remaining = Math.max(0, SCOUT_IDS.length - this.requiredScoutDefeatCount());
              const clearText = this.worldMapUnlocked ? "\u6CBF\u8DEF\u5BC6\u63A2\u5DF2\u6E05\u527F\uFF0C\u8206\u56FE\u4E0A\u51FA\u73B0\u4E86\u65B0\u7684\u8DEF\u7EBF\u3002" : `\u8FD8\u5269 ${remaining} \u5904\u5BC6\u63A2\u636E\u70B9\u3002`;
              this.dialog.show({
                speaker: "\u6218\u6597",
                text: result === "victory" ? `\u4F0F\u5175\u8D25\u9000\u3002\u4F60\u83B7\u5F97 ${rewards.money} \u4E24\u94F6\u5B50${rewards.items.length ? `\uFF0C${rewards.items.map((item) => `${item.name}\xD7${item.amount}`).join("\u3001")}` : ""}\u3002${clearText}` : "\u6211\u65B9\u8D25\u9000\uFF0C\u6C5F\u6E56\u8DEF\u6B62\u4E8E\u6B64\u5904\u3002",
                choices: [{ label: result === "victory" ? "\u56DE\u5230\u5927\u5730\u56FE" : "\u6E38\u620F\u7ED3\u675F" }]
              });
            }
          });
          this.battle.start();
          this.mode = "battle";
          this.playBattleMusic();
        }
        grantBattleRewards() {
          const reward = BATTLE.rewards || {};
          const money = randomInt(reward.money?.min || 0, reward.money?.max || 0);
          this.money += money;
          const items = [];
          for (const drop of reward.drops || []) {
            if (Math.random() > drop.chance) continue;
            const amount = randomInt(drop.min || 1, drop.max || 1);
            this.items[drop.itemId] = (this.items[drop.itemId] || 0) + amount;
            items.push({ itemId: drop.itemId, name: drop.name, amount });
          }
          return { money, items };
        }
        playCutscene(id) {
          const cutscene = CUTSCENES[id];
          if (!cutscene || this.mode === "cutscene") return;
          this.axis = { x: 0, y: 0 };
          this.touchBindings.clear();
          this.audio?.pause();
          this.activeCutscene = cutscene;
          this.cutsceneFallback = null;
          this.cutsceneDebug = { event: "starting", source: cutscene.source, updatedAt: Date.now() };
          recordCutsceneDiagnostic("starting", this.cutsceneDebug);
          this.mode = "cutscene";
          this.cutscene = new CutscenePlayer({
            viewport: this.viewport,
            source: cutscene.source,
            remoteSource: cutscene.remoteSource,
            playbackDurationMs: cutscene.playbackDurationMs,
            fallbackDelayMs: cutscene.fallbackDelayMs,
            fallbackDurationMs: cutscene.fallbackDurationMs,
            onEvent: (event, audit) => {
              this.cutsceneDebug = {
                event,
                source: audit.resolvedSource || cutscene.source,
                playEvent: audit.playEvent,
                timeUpdates: audit.timeUpdates,
                waitingCount: audit.waitingCount || 0,
                videoCapabilities: audit.videoCapabilities,
                simulatorEventBridgeUnobservable: audit.simulatorEventBridgeUnobservable,
                fallback: audit.fallback,
                error: audit.error,
                updatedAt: Date.now()
              };
              recordCutsceneDiagnostic(event, this.cutsceneDebug);
            },
            onFallback: (reason, audit) => {
              this.cutsceneFallback = {
                reason,
                audit,
                poster: cutscene.poster,
                startedAt: Date.now(),
                durationMs: cutscene.fallbackDurationMs || 4200
              };
            },
            onFinish: (result, audit) => this.finishCutscene(cutscene, result, audit)
          });
          this.cutscene.play();
        }
        finishCutscene(cutscene, result, audit) {
          this.lastCutsceneAudit = audit;
          recordCutsceneDiagnostic("finish", { ...audit, result });
          this.seenCutscenes.add(cutscene.id);
          this.learnedSkills.add(cutscene.rewardSkillId);
          this.cutscene = null;
          this.activeCutscene = null;
          this.cutsceneFallback = null;
          this.cutsceneDebug = null;
          this.mode = "game";
          this.playMusic();
          this.dialog.show({
            speaker: result === "fallback" ? "\u65C1\u767D" : "\u900D\u9065\u9053\u4EBA",
            text: result === "fallback" ? `\u52A8\u753B\u64AD\u653E\u53D7\u9650\uFF0C\u5DF2\u5207\u6362\u4E3A\u5206\u955C\u4F20\u529F\u3002\u4F60\u9886\u609F\u4E86\u201C${cutscene.rewardSkillName}\u201D\u3002` : `\u6E05\u98CE\u5F52\u4E8E\u7ECF\u8109\u3002\u4F60\u9886\u609F\u4E86\u201C${cutscene.rewardSkillName}\u201D\uFF0C\u6218\u6597\u65F6\u53EF\u5FA1\u98CE\u7FA4\u653B\u5E76\u70B9\u4F4F\u654C\u4EBA\u3002`,
            choices: [{ label: "\u8BB0\u4E0B\u5FC3\u6CD5" }]
          });
        }
        enterRoom(id) {
          this.enterMap(id);
        }
        enterMap(id, spawn) {
          const point = this.mapManager.enter(id);
          this.player.x = (spawn || point).x;
          this.player.y = (spawn || point).y;
          this.player.direction = "down";
          this.activeTrigger = null;
          this.lastPromptTriggerId = null;
          this.runMapEntryStory(id);
        }
        runMapEntryStory(id) {
          if (id !== "moonValley" || this.storyFlags.has("moon_valley_reached")) return;
          this.storyFlags.add("moon_valley_reached");
          this.rememberStory("\u82CF\u841D\u5E26\u6C88\u4E34\u5DDD\u8FDB\u5165\u6708\u534E\u8C37\uFF0C\u6708\u534E\u5F1F\u5B50\u8981\u6C42\u5148\u67E5\u6E05\u738B\u5E9C\u7389\u4F69\u6765\u5386\u3002");
          this.dialog.show([
            { speaker: GAME.companionName, text: "\u524D\u9762\u5C31\u662F\u6708\u534E\u8C37\u3002\u8FD9\u91CC\u7684\u4EBA\u4E0D\u7231\u89C1\u5916\u5BA2\uFF0C\u5C24\u5176\u4E0D\u7231\u89C1\u5E26\u7740\u738B\u5E9C\u7389\u4F69\u7684\u4EBA\u3002" },
            { speaker: "\u6708\u534E\u8C37\u5F1F\u5B50", text: "\u8C37\u4E3B\u5931\u8E2A\u540E\uFF0C\u5916\u4EBA\u4E0D\u5F97\u5165\u836F\u5E90\u3002\u4F60\u4EEC\u82E5\u8981\u67E5\u65E7\u4FE1\uFF0C\u5148\u8BC1\u660E\u4E0D\u662F\u5357\u5CAD\u738B\u5E9C\u6D3E\u6765\u7684\u3002" }
          ]);
        }
        acceptPalaceInvitation() {
          this.addItem("palace_invitation", 1);
          this.storyFlags.add("palace_invitation_received");
          this.rememberStory("\u79E6\u665A\u7476\u4EA4\u51FA\u5357\u5CAD\u738B\u5E9C\u8BF7\u5E16\uFF0C\u5E76\u8B66\u544A\u6C88\u4E34\u5DDD\u4E0D\u8981\u8F7B\u4FE1\u738B\u5E9C\u5BC6\u5377\u3002");
          this.dialog.show({ speaker: "\u79E6\u665A\u7476", text: "\u4E0A\u4E00\u4EE3\u4EBA\u7684\u9519\uFF0C\u4E0D\u8BE5\u4E00\u76F4\u538B\u5728\u4F60\u4EEC\u8EAB\u4E0A\u3002\u8BF7\u5E16\u7ED9\u4F60\uFF0C\u81F3\u4E8E\u6211\u7684\u5FC3\u610F\uFF0C\u7B49\u4F60\u6D3B\u7740\u56DE\u6765\u518D\u95EE\u3002", choices: [{ label: "\u6536\u597D\u8BF7\u5E16" }] });
        }
        rememberMoonClue() {
          this.storyFlags.add("heard_swapped_children_clue");
          this.rememberStory("\u7A46\u82B7\u70DF\u900F\u9732\u65E7\u6848\u4E2D\u5B58\u5728\u591A\u4E2A\u88AB\u8C03\u5305\u7684\u5B69\u5B50\u3002");
          this.dialog.show({ speaker: "\u7A46\u82B7\u70DF", text: "\u88AB\u8C03\u5305\u7684\u5B69\u5B50\u4E0D\u6B62\u4E00\u4E2A\u3002\u4F60\u4EE5\u4E3A\u81EA\u5DF1\u662F\u8C01\uFF0C\u738B\u5E9C\u4E5F\u672A\u5FC5\u77E5\u9053\u3002", choices: [{ label: "\u8BB0\u4E0B\u7EBF\u7D22" }] });
        }
        rememberStory(text) {
          this.storyLog.unshift({ text, at: Date.now() });
          this.storyLog = this.storyLog.slice(0, 20);
        }
        saveGame() {
          if (!this.player || !this.mapManager || !this.menuCanResume) {
            this.menuNotice = "\u5F53\u524D\u6CA1\u6709\u53EF\u4FDD\u5B58\u7684\u6E38\u620F\u8FDB\u5EA6";
            return false;
          }
          writeSave(SAVE_KEY, {
            version: 1,
            savedAt: Date.now(),
            mapId: this.mapManager.id,
            x: Math.round(this.player.x),
            y: Math.round(this.player.y),
            money: this.money,
            items: this.items,
            defeatedScouts: [...this.defeatedScouts],
            worldMapUnlocked: this.worldMapUnlocked,
            learnedSkills: [...this.learnedSkills],
            seenCutscenes: [...this.seenCutscenes],
            storyFlags: [...this.storyFlags],
            storyLog: this.storyLog
          });
          this.menuNotice = "\u5B58\u6863\u6210\u529F";
          this.buySfx?.play();
          return true;
        }
        loadGame() {
          const save = readSave(SAVE_KEY);
          if (!save) {
            this.menuNotice = "\u8FD8\u6CA1\u6709\u53EF\u52A0\u8F7D\u7684\u5B58\u6863";
            return false;
          }
          this.mode = "game";
          this.money = save.money ?? 120;
          this.items = save.items || {};
          this.defeatedScouts = new Set(save.defeatedScouts || []);
          this.worldMapUnlocked = Boolean(save.worldMapUnlocked) || this.defeatedScouts.size >= SCOUT_IDS.length;
          this.learnedSkills = new Set(save.learnedSkills || []);
          this.seenCutscenes = new Set(save.seenCutscenes || []);
          this.storyFlags = new Set(save.storyFlags || []);
          this.storyLog = Array.isArray(save.storyLog) ? save.storyLog.slice(0, 20) : [];
          this.enterMap(save.mapId || "world", { x: save.x, y: save.y });
          this.menuCanResume = true;
          this.menuNotice = "";
          this.playMusic();
          return true;
        }
        toggleMusic() {
          this.musicEnabled = !this.musicEnabled;
          if (this.musicEnabled) this.playMusic();
          else this.audio.pause();
        }
        playMusic() {
          this.battleAudio?.pause();
          if (this.musicEnabled) this.audio.play();
        }
        playBattleMusic() {
          this.audio?.pause();
          if (this.musicEnabled) this.battleAudio.play();
        }
        openWorldMap() {
          if (!(this.worldMapUnlocked || this.defeatedScouts.size > 0)) return;
          this.axis = { x: 0, y: 0 };
          this.mode = "worldmap";
        }
        closeWorldMap() {
          this.mode = "game";
        }
        openInventory() {
          this.axis = { x: 0, y: 0 };
          this.mode = "inventory";
        }
        closeInventory() {
          this.mode = "game";
        }
        openShop(shopId) {
          this.axis = { x: 0, y: 0 };
          this.activeShopId = shopId;
          this.shopMessage = "\u9009\u62E9\u8981\u8D2D\u4E70\u7684\u7269\u54C1";
          this.shopNotice = null;
          this.mode = "shop";
        }
        closeShop() {
          this.mode = "game";
          this.activeShopId = null;
          this.shopMessage = "";
          this.shopNotice = null;
        }
        buyItem(itemId) {
          const shop = shopById(this.activeShopId);
          const entry = shop?.stock.find((item2) => item2.itemId === itemId);
          const item = itemById(itemId);
          if (!shop || !entry) {
            this.shopMessage = "\u5E97\u91CC\u6CA1\u6709\u8FD9\u4E2A\u7269\u54C1";
            return;
          }
          const owned = this.items[itemId] || 0;
          if (entry.limit && owned >= entry.limit) {
            this.shopMessage = `${item.name}\u5DF2\u7ECF\u4E70\u8FC7\u4E86`;
            this.shopNotice = { text: `${item.name}\u5DF2\u7ECF\u4E70\u8FC7\u4E86`, time: 1.4, kind: "warn" };
            this.lastShopAudit = { ok: false, reason: "limit", itemId, money: this.money, owned };
            return;
          }
          const price = entry.price ?? item.price ?? 0;
          if (this.money < price) {
            this.shopMessage = "\u94F6\u4E24\u4E0D\u591F";
            this.shopNotice = { text: "\u94F6\u4E24\u4E0D\u591F\uFF0C\u65E0\u6CD5\u8D2D\u4E70", time: 1.4, kind: "warn" };
            this.lastShopAudit = { ok: false, reason: "money", itemId, price, money: this.money, owned };
            return;
          }
          this.money -= price;
          this.addItem(itemId, 1);
          this.buySfx?.play();
          this.shopMessage = `\u4E70\u5230${item.name}\uFF0C\u82B1\u8D39 ${price} \u4E24`;
          this.shopNotice = { text: `\u8D2D\u4E70\u6210\u529F\uFF1A${item.name}`, time: 1.8, kind: "success" };
          this.lastShopAudit = { ok: true, itemId, price, money: this.money, owned: this.items[itemId] };
        }
        addItem(itemId, amount = 1) {
          this.items[itemId] = (this.items[itemId] || 0) + amount;
        }
        battleMapFor(triggerId) {
          if (triggerId === "scout_moon") return "battleBamboo";
          if (triggerId === "scout_archer" || triggerId === "scout_bridge") return "battleBamboo";
          if (triggerId === "scout_gate") return "battleFerry";
          return "battleTemple";
        }
        resolveActiveTrigger() {
          const trigger = this.mapManager.nearby(this.player.boundsAt(this.player.x, this.player.y));
          if (!trigger) return null;
          if (this.defeatedScouts.has(trigger.id)) return null;
          return trigger;
        }
        maybePlayPromptSfx(previousTriggerId, currentTriggerId) {
          if (!currentTriggerId || currentTriggerId === previousTriggerId || currentTriggerId === this.lastPromptTriggerId) return;
          this.lastPromptTriggerId = currentTriggerId;
          this.promptSfx?.play();
        }
        shouldClickSfx(button) {
          if (!button) return false;
          if (["left", "right", "up", "down"].includes(button)) return false;
          return true;
        }
        visibleNpcs() {
          return (this.mapManager.map.npcs || []).filter((npc) => !this.defeatedScouts.has(npc.id));
        }
        worldNodes() {
          return WORLD_NODES.map((node) => {
            if (node.id === "cangshan") return { ...node, status: this.worldMapUnlocked ? "cleared" : "current" };
            if (node.id === "yuehua") return { ...node, status: this.worldMapUnlocked ? "current" : "unlocked" };
            if (this.worldMapUnlocked && node.id === "erhai") return { ...node, status: "unlocked" };
            return node;
          });
        }
        requiredScoutDefeatCount() {
          return SCOUT_IDS.filter((id) => this.defeatedScouts.has(id)).length;
        }
      };
      function randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
      }
      module.exports = { GameApp };
    }
  });

  // wechat-minigame/js/simulatorScenario.js
  var require_simulatorScenario = __commonJS({
    "wechat-minigame/js/simulatorScenario.js"(exports, module) {
      var SIMULATOR_SCENARIO = Object.freeze({ cutscene: null });
      module.exports = { SIMULATOR_SCENARIO };
    }
  });

  // wechat-minigame/game.js
  var require_game = __commonJS({
    "wechat-minigame/game.js"() {
      var { GameApp } = require_gameApp();
      var { SIMULATOR_SCENARIO } = require_simulatorScenario();
      var game = new GameApp();
      globalThis.__cangshanGame = game;
      game.start().then(() => {
        if (SIMULATOR_SCENARIO.cutscene) game.playCutscene(SIMULATOR_SCENARIO.cutscene);
      }).catch((error) => {
        console.error("Failed to start Cangshan RPG", error);
        globalThis.__cangshanLoading?.error?.("\u6E38\u620F\u542F\u52A8\u5931\u8D25", error?.message || String(error));
      });
    }
  });

  // wechat-debug/entry.js
  var require_entry = __commonJS({
    "wechat-debug/entry.js"() {
      var import_wx_shim = __toESM(require_wx_shim());
      var import_game = __toESM(require_game());
    }
  });
  require_entry();
})();
//# sourceMappingURL=game-debug.js.map
