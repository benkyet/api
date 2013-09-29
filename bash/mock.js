var names = [
    'Bargain for those who want to decorate their rooms!!!!',
    'Flatscreen TV',
    'Beautiful Star Wars Canvas',
    'AC101 Book',
    'Droit du commerce international'
];

var prices = [
    20,
    80,
    2000,
    10,
    5
];

var location = [
    'Hackney, London',
    'Brixton, London',
    'Brixton, London',
    'Westminster University Campus',
    'Science Po'
];

var descriptions = [
    "I am a former full-time LondonMet student and have a few house items " +
    "I bought and need to sell because I am going back home and won't be able to carry everything. " +
    "IKEA BLASKA laundry basket for £2 (new £3.25)" +
    "IKEA SKRIBENT Book-end, hardwood for £2 (new £4.50)" +
    "IKEA BYLLAN Laptop support, cream/white for £5 (new £9)" +
    "IKEA SPONTAN Magnetic board, white for £5 (new £10)" +
    "IKEA RIBBA picture frame each for £5" +
    "IKEA DOKUMENT Pencil cup, silver color for £2 (new £3.50/ 2 pack)" +
    "IKEA FORSÅ Work lamp, red £12 (new £17)" +
    "IKEA DOKUMENT Wastepaper basket, silver for £2 (new £5)",

    "6 months old flat screen TV. Ideal for whatever...",

    "This 1/1 pretty much finished - few bits to tidy up but will soon" +
    " be on display at the London West Bank Gallery in Nottinghill - " +
    "one for the fan boys !!",

    "The first semester book for AC101 with Professor Brown.",

    "Le livre necessaire pour la deuxieme annee de droit international a Science Po"



    ];

var pictures = [
    'https://benkyet.s3-eu-west-1.amazonaws.com/test/1377105223300.jpg',
    'https://benkyet.s3-eu-west-1.amazonaws.com/test/1377105379796.jpg',
    'https://benkyet.s3-eu-west-1.amazonaws.com/test/1377108960787.jpg',
    'https://benkyet.s3-eu-west-1.amazonaws.com/test/1377157375585.jpg',
    'https://benkyet.s3-eu-west-1.amazonaws.com/test/1377159244155.jpg'

];

var groups = [
    'LSE',
    'Westminster Uni'
];

var lse_events = [
    {
        name: "Crush - Freshers week",
        link: "https://www.facebook.com/events/160174270855260/?ref=23"
    },
    {
        name: "CARNIVALE - Undergraduate event",
        link: "https://www.facebook.com/events/157407171126712/?ref=23"
    },
    {
        name: "☠ CHAOS @ fabriclondon ☠",
        link: "https://www.facebook.com/events/660443697307829/?ref=22"
    }
];
var westminster_events = [
    {
        name: "Freshers week",
        link: "http://google.com"
    },
    {
        name: "Freshers week 2",
        link: "http://google.com"
    }
];
db.groups.remove();
db.groups.insert({group_list: groups});
db.groups.insert({group: "LSE", events: lse_events, img: "https://s3-eu-west-1.amazonaws.com/benkyet/groups/lse-img.png"});
db.groups.insert({group: "Westminster Uni", events: westminster_events, img: "https://s3-eu-west-1.amazonaws.com/benkyet/groups/west-img.png"});


var seller_ids = ['012345678901234567890123', '012345678901234567890124'];

db.session.remove();
db.session.insert(
    [
        {
            session_id: '1111',
            user_id: '012345678901234567890123'
        },
        {
            session_id: '2222',
            user_id: '012345678901234567890124'
        }
    ]
);


db.user.remove();
//pass, pass2
db.user.insert(
    [{
        username: 'test',
        pass: '$2a$10$fl/OoTliN13EyqnwNSOhOuUT7F5XKg1KTwaJl68MtK6RBpu5hnU9.',
        first: 'test_first',
        last: 'test_last',
        email: 'james.nocentini@gmail.com',
        _id: ObjectId(seller_ids[0])
    },
    {
        username: 'test2',
        pass: '$2a$10$HL8kUj1DtiDMv5qq.NRMT.yrkQFehfH4XphoF30Nf6cgOafheH/bq',
        first: 'test2_first',
        last: 'test2_last',
        email: 'james.nocentini2@gmail.com',
        _id: ObjectId(seller_ids[1])
    }]
);

db.item.remove();
db.counter.remove();

db.counter.insert(
    {
        _id: "ref",
        seq: 0
    }
);

function getNextSequence(name) {
    var ret = db.counter.findAndModify(
        {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
        }
    );

    return ret.seq;
}

var i = 0,
    j = 0,
    ref = 0;

(function mock_items() {
    for(i=0; i<10; i++) {
        for(j=0; j<5; j++) {
            var u = j % 2;
            db.item.insert(
                {
                    ref: getNextSequence('ref'),
                    name: names[j],
                    price: prices[j],
                    location: location[j],
                    description: descriptions[j],
                    pictures: [pictures[j]],
                    group: groups[j],
                    seller_id: ObjectId(seller_ids[u])
                }
            );
        };
    };
})();