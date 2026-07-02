import Hero from '@/components/sections/Hero';
import Pillars from '@/components/sections/Pillars';
import Workspaces from '@/components/sections/Workspaces';
import Spaces from '@/components/sections/Spaces';
import Podcast from '@/components/sections/Podcast';
import Community from '@/components/sections/Community';
import Location from '@/components/sections/Location';

export default function Home() {
  return (
    <main>
      <Hero />
      <Pillars />
      <Workspaces />
      <Spaces />
      <Podcast />
      <Community />
      <Location />
    </main>
  );
}
