Meteor.startup(function () {


    // Start to work on QUEUES (for n) periodically

    // update clusters periodically

    


    // ENSURE INDEXES
    // Cluster._ensureIndex({ "dictionary": 1 });

    // News.remove({});

    // DUMMY STARTUP DATA

    // NEWS Collection
    if(News.find().fetch().length === 0) {
        News.insert({
            title: 'Iran may be reconsidering position on Syria',
            abstract: 'Lorem ipsum Sed et ea est ut proident tempor enim eiusmod ea nulla.',
            content: 'Lorem ipsum Proident ex et magna labore id in culpa adipisicing minim incididunt officia eiusmod exercitation ut Duis veniam elit culpa ex fugiat reprehenderit nisi Excepteur ut anim est nulla velit nisi commodo Excepteur quis cupidatat aliqua do eu labore ea nulla consequat veniam commodo proident irure aliquip labore sit non non ad magna incididunt Ut quis irure cupidatat cupidatat dolor labore voluptate exercitation eiusmod occaecat dolor ullamco nostrud aute ut cupidatat qui velit aliquip commodo nostrud Excepteur veniam irure occaecat velit do qui sed dolor dolor dolor est adipisicing in laborum eiusmod ut dolor sed amet in ad laborum velit ea minim nulla in dolore id laboris dolore elit cupidatat Ut laborum quis officia proident Ut laboris amet deserunt exercitation culpa ut Excepteur cillum adipisicing Ut est id occaecat labore nostrud ad ullamco aliqua in.',
            metaData: {
                pubDate: 1367445623,
                author: {
                    name: 'John Make',
                    url: 'http://hisprfile.com'
                },
                source: {
                    id: 'CNN',
                    url: 'http://cnn.com/article/2342'
                }
            },
            clusterData: {
                topics: ['iran','syria','terror','alqaida','middle east','israel'],
                subTopic: 'iran',
                side: 'con',
                opinionated: 6, // 1-10
                importance: 2324 // 0-n (votes for this article)
            },
            media: {
                images: ['img/tests/tiles/img1.jpg','img/tests/tiles/img2.jpg','img/tests/tiles/img3.jpg','img/tests/tiles/img2.jpg','img/tests/tiles/img2.jpg','img/tests/tiles/img2.jpg','img/tests/tiles/img2.jpg'],
                videos: []
            }
        });
        News.insert({
            title: 'Is Turkey at war with Syria?',
            abstract: 'Lorem ipsum Reprehenderit veniam est ea Ut irure ex exercitation incididunt voluptate laboris nostrud.',
            content: 'Lorem ipsum Voluptate anim enim consectetur aute magna Ut ex commodo cillum Ut anim nulla ullamco esse nulla dolor sint veniam fugiat exercitation sed cupidatat incididunt ex sint et incididunt cupidatat in sed reprehenderit magna ea et esse tempor velit est eu in cillum pariatur consequat dolor do culpa nulla nulla ut sunt eiusmod incididunt Duis nisi eiusmod tempor et mollit et minim aliquip ad minim Duis in in ad reprehenderit ullamco dolor laborum sit velit ut esse irure in officia anim dolor ut deserunt mollit enim ut non aliqua tempor magna ex et in consequat cupidatat Duis eu dolore enim Ut esse voluptate voluptate consectetur labore qui in dolore proident sed dolor sed nostrud dolor Excepteur exercitation veniam consequat culpa ea laborum aute consectetur dolore in laboris commodo quis anim dolor quis pariatur dolore occaecat aliqua mollit officia reprehenderit enim do dolore eu sint ea dolor consectetur cupidatat officia exercitation ea exercitation amet sit in id id sint sunt labore nisi Ut fugiat id quis irure irure Excepteur fugiat in nisi nulla dolor dolor ut id aliqua dolore in exercitation laborum velit aliqua id tempor culpa ex officia incididunt qui occaecat in.',
            metaData: {
                pubDate: 1367445623,
                author: {
                    name: 'John Sushi',
                    url: 'http://hisprfile.com'
                },
                source: {
                    id: 'FOX News',
                    url: 'http://foxnews.com/article/2211'
                }
            },
            clusterData: {
                topics: ['turkey','syria','war','middle east'],
                subTopic: 'syria',
                side: 'con',
                opinionated: 2, // 1-10
                importance: 1200 // 0-n (votes for this article)
            },
            media: {
                images: ['img/tests/tiles/img2.jpg','img/tests/tiles/img1.jpg'],
                videos: []
            }
        });
        News.insert({
            title: 'Is Turkey at war with Syria?',
            abstract: 'Lorem ipsum Reprehenderit veniam est ea Ut irure ex exercitation incididunt voluptate laboris nostrud.',
            content: 'Lorem ipsum Voluptate anim enim consectetur aute magna Ut ex commodo cillum Ut anim nulla ullamco esse nulla dolor sint veniam fugiat exercitation sed cupidatat incididunt ex sint et incididunt cupidatat in sed reprehenderit magna ea et esse tempor velit est eu in cillum pariatur consequat dolor do culpa nulla nulla ut sunt eiusmod incididunt Duis nisi eiusmod tempor et mollit et minim aliquip ad minim Duis in in ad reprehenderit ullamco dolor laborum sit velit ut esse irure in officia anim dolor ut deserunt mollit enim ut non aliqua tempor magna ex et in consequat cupidatat Duis eu dolore enim Ut esse voluptate voluptate consectetur labore qui in dolore proident sed dolor sed nostrud dolor Excepteur exercitation veniam consequat culpa ea laborum aute consectetur dolore in laboris commodo quis anim dolor quis pariatur dolore occaecat aliqua mollit officia reprehenderit enim do dolore eu sint ea dolor consectetur cupidatat officia exercitation ea exercitation amet sit in id id sint sunt labore nisi Ut fugiat id quis irure irure Excepteur fugiat in nisi nulla dolor dolor ut id aliqua dolore in exercitation laborum velit aliqua id tempor culpa ex officia incididunt qui occaecat in.',
            metaData: {
                pubDate: 1362443643,
                author: {
                    name: 'Maik Sserie',
                    url: 'http://hisprfile.com'
                },
                source: {
                    id: 'FOX News',
                    url: 'http://foxnews.com/article/2211'
                }
            },
            clusterData: {
                topics: ['turkey','syria','war','middle east'],
                subTopic: 'syria',
                side: 'con',
                opinionated: 2, // 1-10
                importance: 1000 // 0-n (votes for this article)
            },
            media: {
                images: ['img/tests/tiles/img2.jpg'],
                videos: []
            }
        });
        News.insert({
            title: 'U.S. declares Syrian rebel group a terrorist body',
            abstract: 'Lorem ipsum Nisi pariatur commodo dolor adipisicing id.',
            content: 'Lorem ipsum Excepteur aute enim sed velit quis laboris eiusmod in consectetur aute incididunt laboris ut sed mollit officia aute enim amet nisi commodo dolore eu qui magna in dolore dolor dolore.',
            metaData: {
                pubDate: 1327445630,
                author: {
                    name: 'John Serie',
                    url: ''
                },
                source: {
                    id: 'ABC',
                    url: 'http://abc.com/article/4443'
                }
            },
            clusterData: {
                topics: ['usa','syria','terror','rebels','middle east','weapons'],
                subTopic: 'usa',
                side: 'con',
                opinionated: 4, // 1-10
                importance: 30 // 0-n (votes for this article)
            },
            media: {
                images: [],
                videos: []
            }
        });
    }

    // Cluster.remove({});

    // CLUSTER collection
    if(Cluster.find().fetch().length === 0) {
        Cluster.insert({
            name: 'terrorism',
            dictionary: [
                {name: 'terror', score: 32},
                {name: 'terrorism', score: 53},
                {name: 'alqaida', score: 12},
                {name: 'al-qaida', score: 45},
                {name: 'terrorismus', score: 13},
                {name: 'afghanistan', score: 4}
            ],
            articles: [
                {id: "TeD2B4PfxJ33avugN", score: 234},
                {id: "vDLBH7GxBTMdQGSkf", score: 23},
                {id: "JuHJ2wRLpYFjp8rat", score: 34},
                {id: "ZygrA5gjyEfXTkoYA", score: 553}
            ]
        });
        Cluster.insert({
            name: 'syria',
            dictionary: [
                {name: 'syria', score: 32},
                {name: 'syrien', score: 53}
            ],
            articles: [
                {id: "ZygrA5gjyEfXTkoYA", score: 14},
                {id: "JuHJ2wRLpYFjp8rat", score: 233},
                {id: "nHnw7zevbvzLTzssN", score: 53}
            ]
        });
    }

    // SOURCES collection
    if(Sources.find().fetch().length === 0) {
        Sources.insert({
            name: 'CNN',
            slogan: '',
            url: 'htp://cnn.com',
            rss: 'http://cnn.com/feed',
            api: 'http://cnn.com/api',
            crawlInfo: {
                lastCheck: 1332443643
            }
        });
        Sources.insert({
            name: 'Fox News',
            slogan: 'Fair and Balanced',
            url: 'htp://foxnews.com',
            rss: 'http://foxnews.com/feed',
            api: 'http://foxnews.com/api',
            crawlInfo: {
                lastCheck: 1322343643
            }
        });
    }

    // QUEUE collection
    if(Queue.find().fetch().length === 0) {
        Queue.insert({
            query: 'leistungsschutzrecht bundestag',
            time: 1322323642,
            cluster: 'dfsdferfdsf23wdqd' // last cluster was
        });
    }

    // CRAWL collection
    if(Crawl.find().fetch().length === 0) {
        Crawl.insert({
            url: 'http://test.de/soepage',
            time: 1322343643
        });
    }

});