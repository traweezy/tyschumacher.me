type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  headline: string;
  subhead: string;
  bio: readonly [string, string];
  workingStyle: string;
};

export const profile = {
  name: "Tyler Schumacher",
  role: "Principal product engineer",
  location: "Buffalo, NY",
  email: "tyschumacher@proton.me",
  headline: "Software for teams that work live.",
  subhead:
    "I build web tools for trading, sportsbook, and operations teams where the screen has to be clear and the system has to be trustworthy.",
  bio: [
    "I like interfaces that make the next move obvious.",
    "Most of my work sits between product pressure, system behavior, and the people who need both to hold up.",
  ],
  workingStyle:
    "I turn unclear product pressure into tools, services, and release paths teams can operate without guesswork.",
} satisfies Profile;
