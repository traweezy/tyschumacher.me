type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  experience: string;
  headline: string;
  subhead: string;
};

export const profile = {
  name: "Tyler Schumacher",
  role: "Senior Full Stack and Product Engineer",
  location: "Buffalo, NY",
  email: "tyschumacher@proton.me",
  experience: "10+ years",
  headline: "Software for teams that work live.",
  subhead:
    "With 10+ years of experience, I build real time sportsbook, electronic trading, banking, commerce, and AI enabled software that helps teams understand changing information and act with confidence.",
} satisfies Profile;
