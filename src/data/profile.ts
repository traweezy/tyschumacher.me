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
    "Freelance full stack and product engineering, based in Buffalo. I build websites, commerce systems, integrations, and internal tools, with current client work for Remorseless Records. My 10+ years of experience span sportsbook, trading, banking, and applied AI.",
} satisfies Profile;
