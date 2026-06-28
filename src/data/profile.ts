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
    "I build interfaces and services for trading, sportsbook, and operations teams that need fast decisions, visible state, and reliable releases.",
  bio: [
    "I like interfaces that make the next move obvious.",
    "Most of my work sits between the product decision, the system behavior, and the team that has to support both.",
  ],
  workingStyle:
    "I turn ambiguous product pressure into web tools, services, and release paths teams can support.",
} satisfies Profile;
