import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { FAQ_ITEMS } from '@/data/faq';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: number;
}

function AccordionItem({ question, answer, isOpen, onToggle, id }: AccordionItemProps) {
  const headingId = `faq-heading-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <button
        id={headingId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left group cursor-pointer bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-900 font-semibold pr-4 group-hover:text-brand-teal transition-colors">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={clsx(
            'text-brand-teal shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <p className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-white">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <section className="py-20 lg:py-28 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-yellow/20 text-yellow-800 text-xs font-bold uppercase tracking-widest">
            Dúvidas Frequentes
          </div>
          <h2 className="text-4xl font-black text-brand-teal mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços
          </p>
        </div>

        {/* Sem role="list": os filhos são accordions, não listitems — a ARIA
            exige role="listitem" nos filhos diretos de um role="list". */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
