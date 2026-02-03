
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const content = {
  es: {
    title: "Política de Privacidad",
    back: "Volver al Inicio",
    updated: "Última actualización: Marzo 2026",
    section1: "1. Recopilación de Datos",
    text1: "Recopilamos información básica necesaria para proporcionar nuestros servicios de tours virtuales, incluyendo datos de contacto y detalles de las propiedades que desea visualizar.",
    section2: "2. Uso de la Información",
    text2: "Su información se utiliza exclusivamente para la gestión de sus tours y para mejorar la experiencia del usuario. Nunca vendemos sus datos a terceros.",
    section3: "3. Seguridad",
    text3: "Implementamos medidas de seguridad de grado industrial para proteger sus imágenes y datos personales. Utilizamos infraestructura en la nube segura y protocolos de encriptación."
  },
  en: {
    title: "Privacy Policy",
    back: "Back to Home",
    updated: "Last updated: March 2026",
    section1: "1. Data Collection",
    text1: "We collect basic information necessary to provide our virtual tour services, including contact details and details of the properties you wish to visualize.",
    section2: "2. Use of Information",
    text2: "Your information is used exclusively for managing your tours and improving user experience. We never sell your data to third parties.",
    section3: "3. Security",
    text3: "We implement industrial-grade security measures to protect your images and personal data. We use secure cloud infrastructure and encryption protocols."
  },
  pt: {
    title: "Política de Privacidade",
    back: "Voltar ao Início",
    updated: "Última atualização: Março 2026",
    section1: "1. Coleta de Dados",
    text1: "Coletamos informações básicas necessárias para fornecer nossos serviços de tours virtuais, incluindo detalhes de contato e detalhes das propriedades que você deseja visualizar.",
    section2: "2. Uso da Informação",
    text2: "Suas informações são usadas exclusivamente para gerenciar seus tours e melhorar a experiência do usuário. Nunca vendemos seus dados para terceiros.",
    section3: "3. Segurança",
    text3: "Implementamos medidas de segurança de nível industrial para proteger suas imagens e dados pessoais. Usamos infraestrutura de nuvem segura e protocolos de criptografia."
  }
};

export default function PrivacyPage() {
  const [lang, setLang] = useState<'es' | 'en' | 'pt'>('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('tour-weaver-lang') as any;
    if (savedLang && content[savedLang as 'es' | 'en' | 'pt']) {
      setLang(savedLang);
    }
  }, []);

  const t = content[lang];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </Button>
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-none">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-headline">{t.title}</h1>
              <p className="text-sm text-muted-foreground">{t.updated}</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">{t.section1}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.text1}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">{t.section2}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.text2}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">{t.section3}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.text3}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
