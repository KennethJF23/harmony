/**
 * Scientific Citation Component
 * Displays research citations with hover tooltips
 * Used throughout the app to provide scientific backing
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface Citation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
}

interface ScientificCitationProps {
  citation: Citation;
  inline?: boolean;
  className?: string;
}

const ScientificCitation = ({ 
  citation, 
  inline = true, 
  className = '' 
}: ScientificCitationProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const citationText = `${citation.authors} (${citation.year})`;

  if (inline) {
    return (
      <span className="relative inline-block">
        <button
          className={`text-[var(--primary)] hover:text-[var(--secondary)] underline decoration-dotted transition-colors cursor-help ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.preventDefault();
            if (citation.doi) {
              window.open(`https://doi.org/${citation.doi}`, '_blank');
            }
          }}
          aria-label={`Citation: ${citationText}`}
        >
          {citationText}
        </button>

        {/* Tooltip */}
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 max-w-[90vw] z-[9999] pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#1a1f35] border border-[var(--primary)]/30 rounded-xl p-4 shadow-2xl">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white mb-1">
                    {citation.authors} ({citation.year})
                  </p>
                  <p className="text-xs text-gray-300 mb-2 leading-relaxed">
                    {citation.title}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    {citation.journal}
                  </p>
                  {citation.doi && (
                    <p className="text-xs text-[var(--primary)] mt-2">
                      DOI: {citation.doi}
                    </p>
                  )}
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                <div className="border-8 border-transparent border-t-[#1a1f35]" />
              </div>
            </div>
          </motion.div>
        )}
      </span>
    );
  }

  // Card display
  return (
    <motion.div
      className={`bg-[var(--surface)] border border-[var(--primary)]/20 rounded-xl p-4 hover:border-[var(--primary)]/40 transition-all ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => {
        if (citation.doi) {
          window.open(`https://doi.org/${citation.doi}`, '_blank');
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--foreground)] mb-1">
            {citation.authors} ({citation.year})
          </p>
          <p className="text-sm text-[var(--foreground)]/80 mb-2 leading-relaxed">
            {citation.title}
          </p>
          <p className="text-xs text-[var(--foreground)]/60 italic mb-2">
            {citation.journal}
          </p>
          {citation.doi && (
            <a
              href={`https://doi.org/${citation.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              DOI: {citation.doi} →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Predefined citations for easy reuse
export const CITATIONS = {
  OSTER_1973: {
    id: 'oster_1973',
    authors: 'Oster, G.',
    year: 1973,
    title: 'Auditory beats in the brain',
    journal: 'Scientific American, 229(4), 94-102',
    doi: '10.1038/scientificamerican1073-94',
  },
  JIRAKITTAYAKORN_2017: {
    id: 'jirakittayakorn_2017',
    authors: 'Jirakittayakorn, N., & Wongsawat, Y.',
    year: 2017,
    title: 'Brain responses to 40-Hz binaural beat and effects on emotion and memory',
    journal: 'International Journal of Psychophysiology, 120, 96-107',
    doi: '10.1016/j.ijpsycho.2017.07.010',
  },
  WAHBEH_2007: {
    id: 'wahbeh_2007',
    authors: 'Wahbeh, H., et al.',
    year: 2007,
    title: 'Binaural beat technology in humans: A pilot study to assess psychologic and physiologic effects',
    journal: 'The Journal of Alternative and Complementary Medicine, 13(1), 25-32',
    doi: '10.1089/acm.2006.6196',
  },
  KLIMESCH_2007: {
    id: 'klimesch_2007',
    authors: 'Klimesch, W., et al.',
    year: 2007,
    title: 'EEG alpha oscillations: The inhibition-timing hypothesis',
    journal: 'Brain Research Reviews, 53(1), 63-88',
    doi: '10.1016/j.brainresrev.2006.06.003',
  },
  DANG_VU_2008: {
    id: 'dang_vu_2008',
    authors: 'Dang-Vu, T. T., et al.',
    year: 2008,
    title: 'Spontaneous neural activity during human slow wave sleep',
    journal: 'Proceedings of the National Academy of Sciences, 105(39), 15160-15165',
    doi: '10.1073/pnas.0801819105',
  },
  FINK_2014: {
    id: 'fink_2014',
    authors: 'Fink, A., & Benedek, M.',
    year: 2014,
    title: 'EEG alpha power and creative ideation',
    journal: 'Neuroscience & Biobehavioral Reviews, 44, 111-123',
    doi: '10.1016/j.neubiorev.2012.12.002',
  },
  CAHN_2006: {
    id: 'cahn_2006',
    authors: 'Cahn, B. R., & Polich, J.',
    year: 2006,
    title: 'Meditation states and traits: EEG, ERP, and neuroimaging studies',
    journal: 'Psychological Bulletin, 132(2), 180-211',
    doi: '10.1037/0033-2909.132.2.180',
  },
  EGNER_2004: {
    id: 'egner_2004',
    authors: 'Egner, T., & Gruzelier, J. H.',
    year: 2004,
    title: 'EEG biofeedback of low beta band components: frequency-specific effects on variables of attention and event-related brain potentials',
    journal: 'Clinical Neurophysiology, 115(1), 131-139',
    doi: '10.1016/S1388-2457(03)00353-5',
  },
} as const;

export default ScientificCitation;
