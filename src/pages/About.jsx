import SEO from '@components/seo/SEO';
import JsonLd from '@components/seo/JsonLd';
import { SITE_CONFIG } from '@config/site';
import { Shield, Eye, Lock, Users, Globe, FileText } from 'lucide-react';

export default function About() {
  const organizationSchema = {
    '@context': 'https://schema.org', '@type': 'NewsMediaOrganization',
    name: SITE_CONFIG.name, url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: ['https://twitter.com/truthvault', 'https://facebook.com/truthvault', 'https://github.com/truthvault'],
    description: SITE_CONFIG.description,
  };

  const values = [
    { icon: Eye, title: 'Transparency', description: 'We believe in radical transparency. Our methods, sources, and funding are open to scrutiny.' },
    { icon: Shield, title: 'Integrity', description: 'Every story undergoes rigorous fact-checking and editorial review before publication.' },
    { icon: Lock, title: 'Independence', description: 'We accept no corporate funding or political influence. Our only loyalty is to the truth.' },
    { icon: Users, title: 'Community', description: 'We amplify voices from marginalized communities and protect whistleblowers.' },
    { icon: Globe, title: 'Impact', description: 'Our investigations have led to policy changes, prosecutions, and public accountability.' },
    { icon: FileText, title: 'Rigor', description: 'We follow the highest standards of investigative journalism and ethical reporting.' },
  ];

  return (
    <>
      <SEO title="About Us" description="Learn about Truth Vault's mission, values, and commitment to independent investigative journalism." url={`${SITE_CONFIG.url}/about`} />
      <JsonLd data={organizationSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-vault-900 dark:text-white mb-6">About Truth Vault</h1>
        <div className="prose dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-vault-600 dark:text-vault-400 leading-relaxed">Truth Vault is an independent investigative journalism platform dedicated to uncovering facts, exposing corruption, and amplifying voices that matter. Founded in 2024, we operate on the fundamental belief that access to accurate information is a human right and that transparency is the foundation of a just society.</p>
          <p className="text-vault-600 dark:text-vault-400 leading-relaxed">Our team of experienced journalists, data analysts, and researchers work tirelessly to bring you stories that mainstream media often overlooks. From corporate fraud to government corruption, from environmental crises to human rights abuses, we follow the facts wherever they lead.</p>
        </div>
        <h2 className="text-2xl font-bold text-vault-900 dark:text-white mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {values.map((value) => (
            <div key={value.title} className="card p-6">
              <value.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-bold text-vault-900 dark:text-white mb-2">{value.title}</h3>
              <p className="text-sm text-vault-600 dark:text-vault-400">{value.description}</p>
            </div>
          ))}
        </div>
        <div className="card p-8 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <h2 className="text-2xl font-bold text-vault-900 dark:text-white mb-4">Support Our Work</h2>
          <p className="text-vault-600 dark:text-vault-400 mb-4">Truth Vault is funded entirely by readers like you. We accept no advertising, no corporate sponsorships, and no government grants. Your support ensures our independence.</p>
          <p className="text-sm text-vault-500 dark:text-vault-400">Currently, we are building our platform. Stay tuned for membership options and ways to contribute.</p>
        </div>
      </div>
    </>
  );
}
