var groups = [
    'LSE'
];

db.session.remove();
db.groups.remove();
db.user.remove();
db.item.remove();
db.counter.remove();

db.groups.insert({group_list: groups});

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
        name: "☠ CHAOS @ fabriclondon ☠ Freshers Festival ☠",
        link: "https://www.facebook.com/events/660443697307829/?ref=22"
    }
];

db.groups.insert(
    {
        group: "LSE",
        events: lse_events,
        img: "https://s3-eu-west-1.amazonaws.com/benkyet/groups/lse-img.png"
    });