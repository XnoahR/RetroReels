export const sampleUsers = [
  {
    email: "mika@retroreels.test",
    name: "Mika Cassette",
    bio: "Late-night city pop hunter and cassette shelf organizer.",
    avatarUrl: "/subaruhoshino.jpeg",
    purchases: ["4", "7", "19"],
    cart: ["10"],
    posts: [
      { id: "seed-post-mika-1", productId: "4", channel: "Now Spinning", body: "ANRI on vinyl after midnight still feels like the cleanest way to reset the room." },
      { id: "seed-post-mika-2", productId: "19", channel: "Listening Wall", body: "Picked up No. 1 Party Anthem for the slow-burn side of the shelf.", imageUrl: "/no1partyanthem.png" },
    ],
  },
  {
    email: "raka@retroreels.test",
    name: "Raka Rewind",
    bio: "VHS collector, fuzzy synth enjoyer, permanent rewinder.",
    avatarUrl: "/Yoru.jpeg",
    purchases: ["2", "8", "11"],
    cart: ["15"],
    posts: [
      { id: "seed-post-raka-1", productId: "8", channel: "Tape Finds", body: "This As The World Caves In tape has the exact rainy-window mood I wanted." },
    ],
  },
  {
    email: "naya@retroreels.test",
    name: "Naya Needle",
    bio: "Dream-pop scout with a soft spot for bright cover art.",
    avatarUrl: "/oguri.jpeg",
    purchases: ["3", "12", "16"],
    cart: ["5"],
    posts: [
      { id: "seed-post-naya-1", productId: "3", channel: "Listening Wall", body: "Liquid-Formed Sadness is going straight into the comfort rotation." },
      { id: "seed-post-naya-2", productId: "16", channel: "Shelf Notes", body: "Monokrom sounds warmer than expected. Good quiet-afternoon pickup." },
    ],
  },
  {
    email: "dio@retroreels.test",
    name: "Dio Drift",
    bio: "Alt-rock browser who writes too much about chorus texture.",
    avatarUrl: "/kyomoto.jpg",
    purchases: ["5", "10", "19"],
    cart: ["13"],
    posts: [
      { id: "seed-post-dio-1", productId: "10", channel: "Listening Wall", body: "505 is still undefeated for songs that feel like driving nowhere on purpose. #rock" },
      { id: "seed-post-dio-2", productId: "5", channel: "Needle Drop", body: "Wanderlust on cassette has this scratchy little pulse that makes the whole track feel more awake." },
    ],
  },
  {
    email: "sari@retroreels.test",
    name: "Sari Static",
    bio: "Indo cover loyalist, soft synth defender, long-comment specialist.",
    avatarUrl: "/download (12).jpg",
    purchases: ["11", "12", "14"],
    cart: ["16"],
    posts: [
      { id: "seed-post-sari-1", productId: "12", channel: "Indo Covers", body: "Semua Tentangmu keeps proving that a good melody does not need to shout. #indo #covers", imageUrl: "/subaruhoshino.jpeg" },
    ],
  },
  {
    email: "beni@retroreels.test",
    name: "Beni Bootleg",
    bio: "VHS shelf regular with strong opinions about tape texture.",
    avatarUrl: "/ejm3.jpg",
    purchases: ["1", "6", "18"],
    cart: ["3"],
    posts: [
      { id: "seed-post-beni-1", productId: "18", channel: "Tape Scan", body: "Somewhere Only We Know as a VHS note feels like finding a familiar street in a dream. #vhs", imageUrl: "/Yoru.jpeg" },
    ],
  },
] as const;

export const userProfiles = [
  {
    email: "user@retroreels.test",
    name: "Retro User",
    bio: "Browsing the wall for the next favorite pressing.",
    avatarUrl: "/download (1).jpeg",
  },
  ...sampleUsers.map(({ email, name, bio, avatarUrl }) => ({ email, name, bio, avatarUrl })),
] as const;
