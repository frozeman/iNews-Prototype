Meteor.startup(function () {

    // News.remove({});

    // DUMMY STARTUP DATA
    if(News.find().fetch().length === 0) {
      News.insert({
        title: 'Iran may be reconsidering position on Syria',
        abstract: 'Lorem ipsum Sed et ea est ut proident tempor enim eiusmod ea nulla.',
        content: 'Lorem ipsum Proident ex et magna labore id in culpa adipisicing minim incididunt officia eiusmod exercitation ut Duis veniam elit culpa ex fugiat reprehenderit nisi Excepteur ut anim est nulla velit nisi commodo Excepteur quis cupidatat aliqua do eu labore ea nulla consequat veniam commodo proident irure aliquip labore sit non non ad magna incididunt Ut quis irure cupidatat cupidatat dolor labore voluptate exercitation eiusmod occaecat dolor ullamco nostrud aute ut cupidatat qui velit aliquip commodo nostrud Excepteur veniam irure occaecat velit do qui sed dolor dolor dolor est adipisicing in laborum eiusmod ut dolor sed amet in ad laborum velit ea minim nulla in dolore id laboris dolore elit cupidatat Ut laborum quis officia proident Ut laboris amet deserunt exercitation culpa ut Excepteur cillum adipisicing Ut est id occaecat labore nostrud ad ullamco aliqua in.',
        metaData: {
            pubDate: 1367445623,
            author: {
                name: 'John Make',
                link: 'http://hisprfile.com'
            },
            source: {
                id: 'CNN',
                link: 'http://cnn.com/article/2342'
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
                link: 'http://hisprfile.com'
            },
            source: {
                id: 'FOX News',
                link: 'http://foxnews.com/article/2211'
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
                link: 'http://hisprfile.com'
            },
            source: {
                id: 'FOX News',
                link: 'http://foxnews.com/article/2211'
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
                link: ''
            },
            source: {
                id: 'ABC',
                link: 'http://abc.com/article/4443'
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

});