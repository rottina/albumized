chrome.tabs.getCurrent(function(tab) {
  var isBlankTab = (tab.url.indexOf('newtab') !== -1) ? true : false;
});

window.onload = function(isBlankTab){
if(isBlankTab){
  (function() {

      var screen_w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
         screen_h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      debug = false;
      var destroy_list = [];
      var searchTerms = [];

      var bgcolor_pref = (localStorage['albumized_pref_bgcolor'] == undefined) ? '#101019' : '#'+localStorage['albumized_pref_bgcolor'],
          ballcolor_pref = (localStorage['albumized_pref_ballcolor'] == undefined) ? '#1A2433' : '#'+localStorage['albumized_pref_ballcolor'],
          density_pref = (localStorage['albumized_pref_density'] == undefined) ? 1.0 : parseFloat(localStorage['albumized_pref_density']),
          friction_pref = (localStorage['albumized_pref_friction'] == undefined) ? 0.3 : parseFloat(localStorage['albumized_pref_friction']),
          restitution_pref = (localStorage['albumized_pref_restitution'] == undefined) ? 0.3 : parseFloat(localStorage['albumized_pref_restitution']),
          gravity_pref = (localStorage['albumized_pref_gravity'] == undefined) ? 9 : parseInt(localStorage['albumized_pref_gravity']),
          balltotal_pref = (localStorage['albumized_pref_balltotal'] == undefined) ? 18 : parseInt(localStorage['albumized_pref_balltotal']),
          sheep_pref = (localStorage['albumized_pref_sheep'] == undefined) ? false : localStorage['albumized_pref_sheep'];
          if (sheep_pref === 'true') {
            $('header').addClass('sheep').attr('title','Kabob!');
          }

      $(window).resize(function () {
          screen_w = $(window).width();
          screen_h = $(window).height();
          canvas = document.getElementById('canvas-body');
          canvas.width = (screen_w*2);
          canvas.height = (screen_h*2);
          ctx = canvas.getContext('2d');
          ctx.scale(2,2);
          for ( b = world.GetBodyList(); b; b = b.GetNext()) {
            if(b.BoxNumber == 'ground' || b.BoxNumber == 'right'){
              destroy_list.push(b);
            }
          }

          user_data = 'ground';
          add.box({
            x: screen_w / 30 / 2,
            y: screen_h / 30 +49,
            height: 100,
            width: screen_w / 30,
            color: bgcolor_pref,
            img_src: 999,
            isStatic: true
          });

          user_data = 'right';
          add.box({
            x: screen_w / 30 + 49,
            y: 10000 / 30 / 2,
            height: 10000 / 30,
            width:100,
            color: bgcolor_pref,
            img_src: 999,
            isStatic: true
          });
      });

      var gravity_direction = 0;
      user_data = 1;
      var album_one = document.getElementById('album1'),
          album_two = document.getElementById('album2'),
          album_three = document.getElementById('album3'),
          album_four = document.getElementById('album4'),
          album_five = document.getElementById('album5'),
          album_six = document.getElementById('album6'),
          album_seven = document.getElementById('album7'),
          album_eight = document.getElementById('album8'),
          album_nine = document.getElementById('album9'),
          album_ten = document.getElementById('album10'),
          album_eleven = document.getElementById('album11'),
          album_twelve = document.getElementById('album12'),
          album_thirteen = document.getElementById('album13'),
          album_fourteen = document.getElementById('album14'),
          album_fifteen = document.getElementById('album15'),
          album_sixteen = document.getElementById('album16'),
          img_fro = document.getElementById('fro');

      // Init some useful stuff for easier access
      var b2Vec2 = Box2D.Common.Math.b2Vec2,
          b2AABB = Box2D.Collision.b2AABB,
          b2BodyDef = Box2D.Dynamics.b2BodyDef,
          b2Body = Box2D.Dynamics.b2Body,
          b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
          b2Fixture = Box2D.Dynamics.b2Fixture,
          b2World = Box2D.Dynamics.b2World,
          b2MassData = Box2D.Collision.Shapes.b2MassData,
          b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
          b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
          b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
          b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
          b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

      // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
      window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

      var SCALE,canvas,world,fixDef,ctx,width,height,shapes = {},needToDraw = false;easterEggEnabled = false;
      var albumLink0,albumLink1,albumLink2,albumLink3,albumLink4,albumLink5,albumLink6,albumLink7,
         albumLink8,albumLink9,albumLink10,albumLink11,albumLink12,albumLink13,albumLink14,albumLink15,
         albumLink16 = 'https://witness6.bandcamp.com/releases/?referer=Albumized!';

      var init = {

        start: function(id) {
          this.defaultProperties();
          this.canvas(id);
          box2d.create.world();
          box2d.create.defaultFixture();
          this.surroundings.leftWall();
          this.surroundings.rightWall();
          this.surroundings.ground();
          this.callbacks();
          this.displayPrefsLink();

            var bdy = document.getElementsByTagName('body')[0];
            var canv = document.getElementById('canvas-body');
            canv.style.webkitTransition = 'background 0.2s ease';
            canv.style.background = bgcolor_pref;
            var easter_egg = new Konami();
            easter_egg.code = function() {
                easterEggEnabled = true;
                console.log('Konami!');
                if (easterEggEnabled) {
                    canv.style.background = "transparent url('/img/mattyice.jpg') repeat";
                }
            }
            easter_egg.load();
            bdy.style.webkitTransition = 'background 0.2s ease';
            bdy.style.background = bgcolor_pref;

            if(screen_w < 600) {
                total_random = 5;
            } else {
                total_random = balltotal_pref;
            }
            for (var i = 0; i < total_random; ++i) {
                user_data = i;
                add.random();
            }

            user_data = 1001;
            add.box({ width: 4.98, height: 4.98, img_src: 1001 });
            user_data = 1002;
            add.box({ width: 4.17, height: 4.17, img_src: 1002 });
            user_data = 1003;
            add.box({ width: 4.39, height: 4.39, img_src: 1003 });
            user_data = 1004;
            add.box({
                width: 3.77,
                height: 3.77,
                img_src: 1004
            });
            user_data = 1005;
            add.box({
                width: 4.72,
                height: 4.72,
                img_src: 1005
            });
            user_data = 1006;
            add.box({
                width: 4.91,
                height: 4.91,
                img_src: 1006
            });
            user_data = 1007;
            add.box({
                width: 5.88,
                height: 5.88,
                img_src: 1007
            });
            user_data = 1008;
            add.box({
                width: 5.37,
                height: 5.37,
                img_src: 1008
            });
            user_data = 1009;
            add.box({
                width: 4.88,
                height: 4.88,
                img_src: 1009
            });
            user_data = 1010;
            add.box({
                width: 6.0,
                height: 6.0,
                img_src: 1010
            });
            user_data = 1011;
            add.box({
                width: 5.28,
                height: 5.28,
                img_src: 1011
            });
            user_data = 1012;
            add.box({
                width: 5.02,
                height: 5.02,
                img_src: 1012
            });
            user_data = 1013;
            add.box({
                width: 4.44,
                height: 4.44,
                img_src: 1013
            });
            user_data = 1014;
            add.box({
                width: 4.2,
                height: 4.2,
                img_src: 1014
            });
            user_data = 1015;
            add.box({
                width: 4.72,
                height: 4.72,
                img_src: 1015
            });
            user_data = 1016; //witness
            add.box({
                width: 3.69,
                height: 3.69,
                img_src: 1016
            });
            user_data = 1017; //albumized logo
            add.box({
                width: 1.4,
                height: 1.6,
                img_src: 1017
            });

            setTimeout(function(){
                (function posterize(){
                    loop.step();
                    loop.update();
                    loop.draw();
                    requestAnimFrame(posterize);
                })();
            }, 155);
        },

        displayPrefsLink: function() {
            var prefzlink = chrome.extension.getURL('/options.html');
            $('a').click(function(){window.location = prefzlink});
        },

        getLocalizedLink: function(url) {
            var userLocale = chrome.i18n.getUILanguage() || 'en-US';
            var iTunesCountry = 'us';
            switch(userLocale) {
              case 'ar': iTunesCountry = 'sa'; break;
              case 'am': iTunesCountry = 'bf'; break;
              case 'bg': iTunesCountry = 'bg'; break;
              case 'bn': iTunesCountry = 'in'; break;
              case 'ca': iTunesCountry = 'es'; break;
              case 'cs': iTunesCountry = 'cz'; break;
              case 'da': iTunesCountry = 'dk'; break;
              case 'de': iTunesCountry = 'de'; break;
              case 'el': iTunesCountry = 'gr'; break;
              case 'en': iTunesCountry = 'us'; break;
              case 'en_GB': iTunesCountry = 'gb'; break;
              case 'en_US': iTunesCountry = 'us'; break;
              case 'es': iTunesCountry = 'es'; break;
              case 'es_419': iTunesCountry = 'mx'; break;
              case 'et': iTunesCountry = 'ee'; break;
              case 'fa': iTunesCountry = 'us'; break;
              case 'fi': iTunesCountry = 'fi'; break;
              case 'fil': iTunesCountry = 'ph'; break;
              case 'fr': iTunesCountry = 'fr'; break;
              case 'he': iTunesCountry = 'il'; break;
              case 'hi': iTunesCountry = 'in'; break;
              case 'hr': iTunesCountry = 'hr'; break;
              case 'hu': iTunesCountry = 'hu'; break;
              case 'id': iTunesCountry = 'id'; break;
              case 'it': iTunesCountry = 'it'; break;
              case 'ja': iTunesCountry = 'jp'; break;
              case 'kn': iTunesCountry = 'in'; break;
              case 'ko': iTunesCountry = 'kr'; break;
              case 'lt': iTunesCountry = 'lt'; break;
              case 'lv': iTunesCountry = 'lv'; break;
              case 'ml': iTunesCountry = 'in'; break;
              case 'mr': iTunesCountry = 'in'; break;
              case 'ms': iTunesCountry = 'my'; break;
              case 'nl': iTunesCountry = 'nl'; break;
              case 'no': iTunesCountry = 'no'; break;
              case 'pl': iTunesCountry = 'pl'; break;
              case 'pt_BR': iTunesCountry = 'br'; break;
              case 'pt_PT': iTunesCountry = 'pt'; break;
              case 'ro': iTunesCountry = 'ro'; break;
              case 'ru': iTunesCountry = 'ru'; break;
              case 'sk': iTunesCountry = 'sk'; break;
              case 'sl': iTunesCountry = 'si'; break;
              case 'sr': iTunesCountry = 'si'; break;
              case 'sv': iTunesCountry = 'se'; break;
              case 'sw': iTunesCountry = 'tz'; break;
              case 'ta': iTunesCountry = 'in'; break;
              case 'te': iTunesCountry = 'in'; break;
              case 'th': iTunesCountry = 'th'; break;
              case 'tr': iTunesCountry = 'tr'; break;
              case 'uk': iTunesCountry = 'ua'; break;
              case 'vi': iTunesCountry = 'vn'; break;
              case 'zh_CN': iTunesCountry = 'cn'; break;
              case 'zh_TW': iTunesCountry = 'tw'; break;
              default: iTunesCountry = 'us'; break;
            }
            url = url.replace(url.split('/')[3], iTunesCountry) + '&app=itunes&at=11l9uH';
            return url;
        },

        itunesLookup: function(specialday) {
            var specialday = specialday;
            if (specialday === 16) {
                $('h1').addClass('valentines');
                $('h2').addClass('vday');
              searchTerms = ['love', 'valentine', 'cupid', 'love+stinks', 'arrow+heart', 'chocolate', 'hearts', 'heart', 'dozen+roses'];
            } else if (specialday === 1) {
                $('h1').addClass('happy');
                $('h2').addClass('newyear');
              searchTerms = ['2018','new+years+day'];
            } else if (specialday === 37) {
                $('h1').addClass('merry');
                $('h2').addClass('xmas');
              searchTerms = ['reindeer', 'celebrate+me+home', 'white+christmas', 'christmas', 'most+wonderful+time+of+the+year', 'christmas+tree', 'silent+night', 'merry+christmas','santa+claus', 'white+christmas', 'christmas', 'most+wonderful+time+of+the+year', 'christmas+tree', 'silent+night', 'merry+christmas'];
            } else if (specialday === 42) {
                $('h1').addClass('hallo');
                $('h2').addClass('ween');
              searchTerms = ['michael+myers', 'poltergeist', 'halloween','trick+or+treat','monster+mash','thriller','candy', 'thriller', 'ghoul'];
            } else {
              $.ajax({
                url: 'https://raw.githubusercontent.com/rottina/albumized/master/lib/8fac666a0a596d41fe05ef3d83eca175.json',
                dataType: 'json',
                async: false,
                success: function(json) {
                  searchTerms = $.makeArray(json);
                },
                fail: function(json) {
                  searchTerms = ['100','1000','200','2129','300','400','500','600','700','800','901','M','I','K','E','W','U','Z','H','E','R','E'];
                }
              });
            }

            // var randomTerm = "go+birds";
            var randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
            $("h3").typed({
              strings: [randomTerm.replace(/\+/g,' ')],
              cursorChar: "|",
              startDelay: 808,
              typeSpeed: 7
            });

            var artist, song, albumCover, albumUrl, regex = /100x100/;
            $.getJSON('https://itunes.apple.com/search?media=music&entity=song&attribute=songTerm&limit=16&term='+encodeURIComponent(randomTerm), function(data) {
              $.each(data, function() {
                $.each(this, function(s, song) {
                    albumCover = song.artworkUrl100.replace(regex,'294x294');
                    albumUrl = song.collectionViewUrl;
                    $('#album'+s).attr('src', albumCover);
                    switch(s) {
                        case 0:
                            albumLink0 = init.getLocalizedLink(albumUrl); break;
                        case 1:
                            albumLink1 = init.getLocalizedLink(albumUrl); break;
                        case 2:
                            albumLink2 = init.getLocalizedLink(albumUrl); break;
                        case 3:
                            albumLink3 = init.getLocalizedLink(albumUrl); break;
                        case 4:
                            albumLink4 = init.getLocalizedLink(albumUrl); break;
                        case 5:
                            albumLink5 = init.getLocalizedLink(albumUrl); break;
                        case 6:
                            albumLink6 = init.getLocalizedLink(albumUrl); break;
                        case 7:
                            albumLink7 = init.getLocalizedLink(albumUrl); break;
                        case 8:
                            albumLink8 = init.getLocalizedLink(albumUrl); break;
                        case 9:
                            albumLink9 = init.getLocalizedLink(albumUrl); break;
                        case 10:
                            albumLink10 = init.getLocalizedLink(albumUrl); break;
                        case 11:
                            albumLink11 = init.getLocalizedLink(albumUrl); break;
                        case 12:
                            albumLink12 = init.getLocalizedLink(albumUrl); break;
                        case 13:
                            albumLink13 = init.getLocalizedLink(albumUrl); break;
                        case 14:
                            albumLink14 = init.getLocalizedLink(albumUrl); break;
                        case 15:
                            albumLink15 = init.getLocalizedLink(song.collectionViewUrl); break;
                        default:
                            //boom shakalaka
                    }
                });
              });
            });
        },

        getDate: function() {
            var d = new Date(), mm = d.getMonth() + 1, day = d.getDate(), holidaydigits;
            if (mm == 1 && day == 1) {
                holidaydigits = 2;
            } else if (mm == 2 && day == 14) {
                holidaydigits = 16;
            } else if (mm == 10 && day == 31) {
                holidaydigits = 41;
            } else if (mm == 11 && day == 27) {
                holidaydigits = 38;
            } else if (mm == 12 && day == 24) {
                holidaydigits = 36;
            } else if (mm == 12 && day == 25) {
                holidaydigits = 37;
            } else {
                holidaydigits = 0;
            }
            return holidaydigits;
        },

        defaultProperties: function() {
            SCALE = 30;
        },

        canvas: function(id) {
            canvas = document.getElementById(id);
            canvas.width = (screen_w*2);
            canvas.height = (screen_h*2);
            ctx = canvas.getContext('2d');
            ctx.scale(2,2);
        },

        surroundings: {
            rightWall: function() {
                user_data = 'right';
                add.box({
                    x: screen_w / 30 +49,
                    y: 10000 / 30 / 2,
                    height: 10000 / 30,
                    width:100,
                    color: bgcolor_pref,
                    img_src: 999,
                    isStatic: true
                });
            },
            ground: function() {
                user_data = 'ground';
                add.box({
                    x: screen_w / 30 / 2,
                    y: screen_h / 30 +49,
                    height: 98.5,
                    width: screen_w / 30,
                    color: bgcolor_pref,
                    img_src: 999,
                    isStatic: true
                });
            },

            leftWall: function() {
                user_data = 3003;
                add.box({
                    x: 0.5,
                    y: 10000 / 30 / 2,
                    height: 10000 / 30,
                    width:1,
                    color: bgcolor_pref,
                    img_src: 999,
                    isStatic: true
                });
            }
        },

        callbacks: function() {
            canvas.addEventListener('click', function(e) {
                //Listen for clicks on the canvas.
            }, false);

            // document.addEventListener('keyup', function(e) {
            //     //if(e.keyCode == 191) {
            //         //↑↑↓↓←→←→BA
            //         //38 38 40 40 37 39 37 39 66 65
            //         console.log( e.keyCode );
            //     //}
            // }, false);

        }
      };

      var add = {
        random: function(options) {
            options = options || {};
            this.circle(options);
            // add empty boxes and circles
            //if (Math.random() < 0.5){
            //    this.circle(options);
            //} else {
                //this.box(options);
            //}
        },
        circle: function(options) {
            options.radius = 0.5 + Math.random()*1;
            var shape = new Circle(options);
            shapes[shape.id] = shape;
            box2d.addToWorld(shape);
        },
        box: function(options) {
            rand_box_size = (Math.random()*2)+1.5;
            options.width = options.width || rand_box_size;
            options.height = options.height || rand_box_size;
            var shape = new Box(options);
            shapes[shape.id] = shape;
            box2d.addToWorld(shape);
        }
      };

      var box2d = {
          addToWorld: function(shape) {
              var bodyDef = this.create.bodyDef(shape);
              var body = this.create.body(bodyDef);
              if (shape.radius) {
                this.create.fixtures.circle(body, shape);
              } else {
                this.create.fixtures.box(body, shape);
              }
          },
          create: {
              world: function() {
                  //gravity
                  world = new b2World(
                    new b2Vec2(0, gravity_pref)
                    , false  //allow sleep
                  );
              },
              defaultFixture: function() {
                  fixDef = new b2FixtureDef;
                  fixDef.density = density_pref;
                  fixDef.friction = friction_pref;
                  fixDef.restitution = restitution_pref;
              },
              bodyDef: function(shape) {
                  var bodyDef = new b2BodyDef;
                  if (shape.isStatic == true) {
                      bodyDef.type = b2Body.b2_staticBody;
                  } else {
                      bodyDef.type = b2Body.b2_dynamicBody;
                  }
                  bodyDef.position.x = shape.x;
                  bodyDef.position.y = shape.y;
                  bodyDef.userData = shape.id;
                  bodyDef.angle = shape.angle;
                  return bodyDef;
              },
              body: function(bodyDef) {
                  return world.CreateBody(bodyDef);
              },
              fixtures: {
                  circle: function(body, shape) {
                      fixDef.shape = new b2CircleShape(shape.radius);
                      body.BoxNumber = user_data;
                      body.CreateFixture(fixDef);
                  },
                  box: function(body, shape) {
                      fixDef.shape = new b2PolygonShape;
                      fixDef.shape.SetAsBox(shape.width / 2, shape.height / 2);
                      body.BoxNumber = user_data;
                      body.CreateFixture(fixDef);
                  }
              }
          },
          get: {
            bodySpec: function(b) {
              return {x: b.GetPosition().x, y: b.GetPosition().y, angle: b.GetAngle(), center: {x: b.GetWorldCenter().x, y: b.GetWorldCenter().y}};
            }
          }
      };

      var loop = {
          step: function() {
              var stepRate = 1 / 60;
              world.Step(stepRate, 10, 10);
              world.ClearForces();
          },
          update: function () {
              for (var i in destroy_list) {
                  world.DestroyBody(destroy_list[i]);
                  //shapes[destroy_list[i].GetUserData()] = '';
                  delete shapes[destroy_list[i].GetUserData()];
              }
              destroy_list.length = 0;

              for (var b = world.GetBodyList(); b; b = b.m_next) {
                if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
                  shapes[b.GetUserData()].update(box2d.get.bodySpec(b));
                }
              }
              needToDraw = true;
          },
          draw: function() {
              if (!needToDraw) return;
              if (!debug) ctx.clearRect(0, 0, canvas.width, canvas.height);
              for (var i in shapes) {
                  shapes[i].draw(ctx);
              }
              needToDraw = false;
          }
      };

      var Shape = function(v) {
        this.id = Math.round(Math.random() * 1000000);
        random_x = (Math.random() * (screen_w - 300)) + 300;
        random_x = random_x / 30;

        this.x = v.x || random_x - 3;
        this.y = v.y || Math.random()*30 - 40;

        this.angle = 0;
        this.color = v.color || ballcolor_pref;
        this.center = { x: null, y: null };
        this.isStatic = v.isStatic || false;

        this.update = function(options) {
            this.angle = options.angle;
            this.center = options.center;
            this.x = options.x;
            this.y = options.y;
        };
      };

      var Circle = function(options) {
          Shape.call(this, options);
          this.radius = options.radius || 1;

          this.draw = function() {
            ctx.save();
            ctx.translate(this.x * SCALE, this.y * SCALE);
            ctx.rotate(this.angle);
            ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            ctx.lineWidth = 2;
            ctx.strokeStyle = bgcolor_pref;
            ctx.stroke();
          };
      };
      Circle.prototype = Shape;

      var Box = function(options) {

          Shape.call(this, options);

          this.width = options.width || 4.2;
          this.height = options.height || 4.2;
          this.img_src = options.img_src;
          this.draw = function() {
              ctx.save();
              ctx.translate(this.x * SCALE, this.y * SCALE);
              ctx.rotate(this.angle);
              ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
              ctx.fillStyle = this.color,

              ctx.lineWidth=2;
              ctx.strokeStyle = bgcolor_pref;

              ctx.fillRect(
                  (this.x-(this.width / 2)) * SCALE,
                  (this.y-(this.height / 2)) * SCALE,
                  this.width * SCALE,
                  this.height * SCALE
              );

              if (this.img_src == 1001){
                  img = album_one;
                  ctx.drawImage(img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              } else if (this.img_src == 1002){
                  img = album_two;
                  ctx.drawImage(img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1003){
                  img = album_three;
                  ctx.drawImage(img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1004){
                  img = album_four;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1005){
                  img = album_five;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1006){
                  img = album_six;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              } else if (this.img_src == 1007){
                  img = album_seven;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1008){
                  img = album_eight;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1009){
                  img = album_nine;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1010){
                  img = album_ten;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1011){
                  img = album_eleven;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1012){
                  img = album_twelve;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1013){
                  img = album_thirteen;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1014){
                  img = album_fourteen;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1015){
                  img = album_fifteen;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }
              else if (this.img_src == 1016){
                  img = album_sixteen;
                  ctx.drawImage(
                      img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }

              else if (this.img_src != 999){
                  img = img_fro;
                  ctx.drawImage(img,
                     (this.x-(this.width / 2)) * SCALE,
                      (this.y-(this.height / 2)) * SCALE,
                      this.width * SCALE,
                      this.height * SCALE
                  );
              }

              ctx.strokeRect(
                  (this.x-(this.width / 2)) * SCALE,
                  (this.y-(this.height / 2)) * SCALE,
                  this.width * SCALE,
                  this.height * SCALE
              );
              ctx.restore();
          };
      };

      var specialday = init.getDate() || 0;
      init.
      Lookup(specialday);
      Box.prototype = Shape;
      init.start('canvas-body');

      //mouse
       var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
       var canvasPosition = getElementPosition(document.getElementById('canvas-body'));
       var canvasID = document.getElementById('canvas-body');

       canvasID.addEventListener('mousedown', function(e) {
          isMouseDown = true;
          handleMouseMove(e);
          canvasID.addEventListener('mousemove', handleMouseMove, true);

          body = getBodyAtMouse();
          if (selectedBody !== null) {
              if (selectedBody.BoxNumber == 1001) {
                window.open(albumLink1, '_blank');
              }
              else if(selectedBody.BoxNumber == 1002){
                window.open(albumLink2, '_blank');
              }
              else if(selectedBody.BoxNumber == 1003){
                window.open(albumLink3, '_blank');
              }
              else if(selectedBody.BoxNumber == 1004){
                window.open(albumLink4, '_blank');
              }
              else if(selectedBody.BoxNumber == 1005){
                window.open(albumLink5, '_blank');
              }
              else if(selectedBody.BoxNumber == 1006){
                window.open(albumLink6, '_blank');
              }
              else if(selectedBody.BoxNumber == 1007){
                window.open(albumLink7, '_blank');
              }
              else if(selectedBody.BoxNumber == 1008){
                window.open(albumLink8, '_blank');
              }
              else if(selectedBody.BoxNumber == 1009){
                window.open(albumLink9, '_blank');
              }
              else if(selectedBody.BoxNumber == 1010){
                window.open(albumLink10, '_blank');
              }
              else if(selectedBody.BoxNumber == 1011){
                window.open(albumLink11, '_blank');
              }
              else if(selectedBody.BoxNumber == 1012){
                window.open(albumLink12, '_blank');
              }
              else if(selectedBody.BoxNumber == 1013){
                window.open(albumLink13, '_blank');
              }
              else if(selectedBody.BoxNumber == 1014){
                window.open(albumLink14, '_blank');
              }
              else if(selectedBody.BoxNumber == 1015){
                window.open(albumLink15, '_blank');
              }
              else if(selectedBody.BoxNumber == 1016){
                window.open(albumLink16, '_blank');
              } else {

                   if (gravity_direction == 0){
                      //Add Roof
                      add.box({
                          x: 4000 / 30 / 2,
                          y: 0.5,
                          height: 1,
                          width: 4000 / 30,
                          color: bgcolor_pref,
                          img_src: 999,
                          isStatic: true
                      });
                      selectedBody.ApplyImpulse({ x: 0, y: -300 }, body.GetWorldCenter());
                      gravity_direction = 1;
                  } else if (gravity_direction == 1) {
                    selectedBody.ApplyImpulse({ x: 0, y: -300 }, body.GetWorldCenter());
                  } else if (gravity_direction == 2) {
                    selectedBody.ApplyImpulse({ x: 300, y: 0 }, body.GetWorldCenter());
                  } else if (gravity_direction == 3) {
                    selectedBody.ApplyImpulse({ x: 0, y: 300 }, body.GetWorldCenter());
                  } else if (gravity_direction == 4) {
                    selectedBody.ApplyImpulse({ x: -300, y: 0 }, body.GetWorldCenter());
                  }
              }

          }
       }, true);

       document.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', handleMouseMove, true);
        isMouseDown = false;
        mouseX = undefined;
        mouseY = undefined;
       }, true);

      function handleMouseMove(e) {
        mouseX = (e.clientX - canvasPosition.x) / 30;
        mouseY = (e.clientY - canvasPosition.y) / 30;
      };

       function getBodyAtMouse() {
          mousePVec = new b2Vec2(mouseX, mouseY);
          var aabb = new b2AABB();
          aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
          aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

          // Query the world for overlapping shapes.
          selectedBody = null;
          world.QueryAABB(getBodyCB, aabb);
          return selectedBody;
       }

       function getBodyCB(fixture) {
          if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
           if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
              selectedBody = fixture.GetBody();
              return false;
           }
          }
          return true;
       }

       function getElementPosition(element) {
          var elem=element, tagname='', x=0, y=0;
          while((typeof(elem) == 'object') && (typeof(elem.tagName) != 'undefined')) {
             y += elem.offsetTop;
             x += elem.offsetLeft;
             tagname = elem.tagName.toUpperCase();

             if(tagname == 'BODY')
                elem=0;

             if(typeof(elem) == 'object') {
                if(typeof(elem.offsetParent) == 'object')
                   elem = elem.offsetParent;
             }
          }
          return {x: x, y: y};
       }

  })();
}

}
