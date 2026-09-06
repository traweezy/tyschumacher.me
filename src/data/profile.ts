type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  headline: string;
  subhead: string;
};

export const profile = {
  name: "Tyler Schumacher",
  role: "Senior Full Stack Engineer",
  location: "Buffalo, NY",
  email: "tyschumacher@proton.me",
  headline: "Software for teams that work live.",
  subhead:
    "From live odds to trading workbenches, I build tools that help people understand changing information and act with confidence.",
} satisfies Profile;
