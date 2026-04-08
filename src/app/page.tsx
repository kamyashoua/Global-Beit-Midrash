import { JourneyExperience } from "@/components/journey/JourneyExperience";
import { JourneyProvider } from "@/context/JourneyProvider";

export default function Home() {
  return (
    <JourneyProvider>
      <JourneyExperience />
    </JourneyProvider>
  );
}
