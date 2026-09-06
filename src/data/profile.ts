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
  role: "Software engineer",
  location: "Buffalo, NY",
  email: "tyschumacher@proton.me",
  headline: "Software for teams that work live.",
  subhead:
    "I build interfaces and services for trading, sportsbook, and operations teams that need fast decisions, visible state, and reliable releases.",
  bio: [
    "I work across interfaces, services, and the systems that keep them running.",
    "My background spans sportsbook, electronic trading, and internal platforms.",
  ],
  workingStyle:
    "I work with product teams to turn requirements into usable interfaces, reliable services, and maintainable releases.",
} satisfies Profile;
