module.exports = function (grunt) {

    // подключаем плагин load-grunt-tasks, чтобы не перечислять все прочие плагины
    require('load-grunt-tasks')(grunt);

    // описываем задачи, которые планируем использовать (их запуск - см. низ этого файла)
    grunt.initConfig({

        // компилируем препроцессор
        less: {
            style: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2,
                },
                files: {
                    // в какой файл, из какого файла
                    'src/css/style.css': ['src/less/style.less']
                },
            }
        },

        // обрабатываем postcss-ом (там только autoprefixer, на самом деле)
        postcss: {
            options: {
                processors: [
                    // автопрефиксер и его настройки
                    require("autoprefixer")({ browsers: "last 2 versions" })
                ]
            },
            style: {
                // какие файлы обрабатывать (все .css в указанной папке)
                src: "src/css/*.css"
            }
        },

        // объединяем медиавыражения
        cmq: {
            style: {
                files: {
                    // в какой файл, из какого файла (тут это один и тот же файл)
                    'src/css/style.css': ['src/css/style.css']
                }
            }
        },

        // минимизируем стилевые файлы
        cssmin: {
            style: {
                options: {
                    keepSpecialComments: 0
                },
                files: [{
                    expand: true,
                    // в какой папке брать исходники
                    cwd: 'src/css',
                    // какие файлы 
                    src: ['style.css', 'normalize.css'],
                    // в какую папку писать результат
                    dest: 'build/css',
                    // какое расширение дать результатам обработки
                    ext: '.min.css'
                }]
            }
        },

        // процесс копирования
        copy: {
            // копируем картинки
            img: {
                expand: true,
                // откуда
                cwd: 'src/img/',
                // какие файлы (все картинки (см. расширения) из корня указанной папки и всех подпапок)
                src: ['**/*.{png,jpg,gif,svg}'],
                // куда
                dest: 'build/img/',
            },

            js: {
                expand: true,
                // откуда
                cwd: 'src/js/',
                // какие файлы
                src: ['*.js'],
                // куда
                dest: 'build/js/',
            },
        },

        // обрабатываем разметку (инклуды, простейший шаблонизатор)
        includereplace: {
            html: {
                expand: true,
                // откуда брать исходные файлы
                //cwd: 'src/',
                // какие файлы обрабатывать
                src: '*.html',
                // куда писать результат обработки
                dest: 'build/',
            }
        },

        // публикация на GitHub Pages (будет доступен в сети по адресу http://ВАШ-НИКНЕЙМ.github.io/ВАШ-РЕПОЗИТОРИЙ/)
        'gh-pages': {
            options: {
                // какую папку считать результатом работы
                base: 'build'
            },
            src: '**/*'
        },

        // слежение за файлами
        watch: {
            // перезагрузка? да, детка!
            livereload: {
                options: { livereload: true },
                files: ['build/**/*'],
            },
            // следить за стилями
            style: {
                // за фактом с сохранения каких файлов следить
                files: ['src/less/**/*.less'],
                // какую задачу при этом запускать (сами задачи — см. ниже)
                tasks: ['style'],
                options: {
                    spawn: false,
                },
            },
            // следить за картинками
            images: {
                // за фактом с сохранения каких файлов следить
                files: ['src/img/**/*.{png,jpg,gif}'],
                // какую задачу при этом запускать (сами задачи — см. ниже)
                tasks: ['img'],
                options: {
                    spawn: false
                },
            },
            // следить за файлами разметки
            html: {
                // за фактом с сохранения каких файлов следить
                files: ['*.html'],
                // какую задачу при этом запускать (указан сам процесс)
                tasks: ['includereplace:html'],
                options: {
                    spawn: false
                },
            },
        },

        // локальный сервер, автообновление
        browserSync: {
            dev: {
                bsFiles: {
                    // за изменением каких файлов следить для автообновления открытой в браузере страницы с локального сервера
                    src: [
                        'src/css/*.css',
                        'src/js/*.js',
                        'src/img/*.{png,jpg,gif,svg}',
                        '*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        // корень сервера
                        baseDir: "./",
                    },
                    // синхронизация между браузерами и устройствами (если одна и та же страница открыта в нескольких браузерах)
                    ghostMode: {
                        clicks: true,
                        forms: true,
                        scroll: false
                    }
                }
            }
        },

        //Минификация изображений
        imagemin: {
            options: {
                optimizationLevel: 3
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'build/img/'
                }]
            }
        },

        //svg - спрайт
        svgstore: {
            options: {
                includeTitleElement: false,
                svg: {
                    style: 'display:none',
                },
                cleanup: [
                    'fill',
                ],
            },
            default: {
                files: {
                    'src/img/sprite.svg': ['src/img/svg/*.svg'],
                },
            },
        },

        //Минификация изображений svg
        svgmin: {
            symbols: {
                files: [{
                    expand: true,
                    src: ["src/img/svg/*.svg"]
                }]
            }
        },

        //Удаление неиспользуемого css
        uncss: {
            dist: {
                files: {
                    'src/css/style.css': ['index.html']
                }
            }
        },

        //Минификация html
        htmlmin: {                                        // Task 
            dist: {                                       // Target 
                options: {                                  // Target options 
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files 
                    'build/index.html': 'index.html'        // 'destination': 'source' 
                }
            }
        },

        //css comb
        csscomb: {
            foo: {
                files: {
                    'src/css/style.css': ['src/css/style.css'],
                }
            }
        }
    });


    // задача по умолчанию
    grunt.registerTask('default', [
        'style',
        'img',
        'includereplace:html',
        'copy:js',
        'imagemin',
        'svgmin',
        'svgstore',
        'browserSync',
        'htmlmin',
        'csscomb'
    ]);

    // только компиляция стилей
    grunt.registerTask('style', [
        'less',
        'postcss',
        'cmq',
        'cssmin'
    ]);

    // только обработка картинок
    grunt.registerTask('img', [
        'copy:img',
        'imagemin'
    ]);

    // сборка
    grunt.registerTask('build', [
        'style',
        'img',
        'includereplace:html'
    ]);
};
