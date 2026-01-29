import Hero from './components/Hero';
import IdentityChips from './components/IdentityChips';
import PersonalBranding from './components/PersonalBranding';
import VideoMarquee from './components/VideoMarquee';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export default function Home() {


  // Social & Portfolio Links
  const socialLinks: SocialLink[] = [
    { name: 'Twitch', url: 'https://twitch.tv/jurassic0_', icon: '/twitch.svg' },
    { name: 'YouTube', url: 'https://www.youtube.com/@Jurassic00', icon: '/youtube.svg' },
    { name: 'GitHub', url: 'https://github.com/Jurassic-hehe', icon: '/github.svg' },
    { name: 'Discord', url: 'https://discord.gg/xnXZxQPMr7', icon: '/discord.svg' },
    { name: 'Instagram', url: 'https://www.instagram.com/jurassic0_0/', icon: '/instagram.svg' },
    { name: 'Email', url: 'mailto:jurassicbusiness00@gmail.com', icon: '/gmail.svg' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* About Me Section */}
      <section className="relative w-full py-20 px-4 border-t border-purple-600/30">
        <div className="max-w-4xl mx-auto">
          {/* Identity Chips */}
          <div className="mb-12">
            <IdentityChips variant="compact" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">About Me</h2>
              
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Hey! I’m Atharva Dixit (aka Jurassic) — a gamer, streamer, and content creator who loves having fun, connecting with people, and creating content that entertains and inspires.
                </p>

                <p>
                  I spend my days streaming gameplay, making videos, and building an awesome community. By night, you’ll usually find me editing, gaming, or working on new creative ideas. The best part? Getting to do what I love every single day.
                </p>

                <p>
                  I believe in staying authentic, enjoying the process, and sharing the journey with people who truly get it. Entertainment should feel real — and that’s exactly how I approach everything I create.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full">
                  <span className="text-purple-300 text-sm font-semibold">Streaming</span>
                </div>
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full">
                  <span className="text-purple-300 text-sm font-semibold">Content Creation</span>
                </div>
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full">
                  <span className="text-purple-300 text-sm font-semibold">Editing</span>
                </div>
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full">
                  <span className="text-purple-300 text-sm font-semibold">Gaming</span>
                </div>
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-400/30 rounded-full">
                  <span className="text-purple-300 text-sm font-semibold">Community</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">3</div>
                <div className="text-gray-400 text-sm">Years Streaming</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">50+</div>
                <div className="text-gray-400 text-sm">Videos Created</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Streaming Energy</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">∞</div>
                <div className="text-gray-400 text-sm">Coffee Consumed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video marquee (local clips) */}
      <VideoMarquee />

      {/* My Edits (link) Section */}
      <section className="relative w-full py-20 px-4">
        <PersonalBranding type="divider" />

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 mb-6 leading-tight">
            Featured Work
          </h2>
          <p className="text-xl text-gray-400">
            My edits are available on YouTube and Instagram. See the curated embeds on the My Edits page.
          </p>

          <div className="mt-8">
            <a
              href="/my-edits"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform"
            >
              View My Edits
            </a>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="relative w-full py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-white mb-12">Connect With Me</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="group relative p-6 bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-400/30 rounded-xl hover:border-purple-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="flex flex-col items-center justify-center gap-3 h-full">
                  <img
                    src={link.icon}
                    alt={`${link.name} logo`}
                    className="w-10 h-10 object-contain transform group-hover:scale-125 transition-transform duration-300"
                  />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-purple-300 transition-colors">
                    {link.name}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-20 px-4 border-t border-purple-600/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Want to collaborate?</h3>
          <p className="text-gray-400 mb-10 text-lg">
            Got a project idea? Just wanna chat? Hit me up and let's create something awesome together.
          </p>
          <div className="flex justify-center">
            <a href="mailto:jurassicbusiness00@gmail.com" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-lg font-bold transition-all duration-300 shadow-lg shadow-purple-600/50 hover:shadow-purple-600/70 hover:scale-105 text-center">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-12 px-4 border-t border-purple-600/20 bg-black/50 backdrop-blur">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Personal Branding */}
          <PersonalBranding type="footer" />

          {/* Minimal footer — personal and lightweight */}
          <div className="pt-6 border-t border-purple-600/10" />
        </div>
      </footer>
    </div>
  );
}
