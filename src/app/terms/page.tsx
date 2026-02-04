
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Globe } from 'lucide-react';

const content = {
  es: {
    title: "Condiciones de Uso",
    back: "Volver al Inicio",
    updated: "Última actualización: Enero 2026",
    section1: "1. Aceptación de los Términos",
    text1: "Al acceder y utilizar Tour Weaver, usted acepta estar sujeto a estos términos de servicio. Nuestros servicios están diseñados para profesionales inmobiliarios que buscan mejorar la visualización de sus propiedades.",
    section2: "2. Naturaleza del Servicio (Exclusión de Transacciones)",
    text2: "Tour Weaver es exclusivamente una plataforma de visualización tecnológica. No realizamos, facilitamos ni intervenimos en transacciones de venta, alquiler u otras operaciones inmobiliarias. No somos una agencia inmobiliaria ni un portal de clasificados; nuestro servicio se limita únicamente a la creación y exhibición de tours virtuales 360°.",
    section3: "3. Uso del Servicio",
    text3: "Usted se compromete a utilizar la plataforma de manera ética y profesional. No se permite el uso de imágenes que no le pertenezcan o para las cuales no tenga derechos de distribución.",
    section4: "4. Propiedad Intelectual",
    text4: "El software, diseño y marcas asociadas a Tour Weaver son propiedad exclusiva de la empresa. Los tours generados son propiedad del cliente según el contrato de servicio específico."
  },
  en: {
    title: "Terms of Use",
    back: "Back to Home",
    updated: "Last updated: January 2026",
    section1: "1. Acceptance of Terms",
    text1: "By accessing and using Tour Weaver, you agree to be bound by these terms of service. Our services are designed for real estate professionals looking to improve their property visualization.",
    section2: "2. Nature of Service (Exclusion of Transactions)",
    text2: "Tour Weaver is exclusively a technological visualization platform. We do not perform, facilitate, or intervene in sales, rentals, or other real estate transactions. We are not a real estate agency or a classifieds portal; our service is limited solely to the creation and display of 360° virtual tours.",
    section3: "3. Use of Service",
    text3: "You agree to use the platform in an ethical and professional manner. Using images that do not belong to you or for which you do not have distribution rights is not allowed.",
    section4: "4. Intellectual Property",
    text4: "The software, design, and trademarks associated with Tour Weaver are the exclusive property of the company. Generated tours are property of the client according to the specific service contract."
  },
  pt: {
    title: "Termos de Uso",
    back: "Voltar ao Início",
    updated: "Última actualización: Janeiro 2026",
    section1: "1. Aceitação de Termos",
    text1: "Ao acessar e usar o Tour Weaver, você concorda em cumprir estes termos de serviço. Nossos servicios são projetados para profissionais imobiliários que buscam melhorar a visualização de suas propriedades.",
    section2: "2. Natureza do Serviço (Exclusão de Transações)",
    text2: "O Tour Weaver é exclusivamente uma plataforma de visualização tecnológica. Não realizamos, facilitamos ou intervimos em vendas, aluguéis ou outras transações imobiliárias. Não somos uma agência imobiliária nem um portal de classificados; nosso serviço limita-se apenas à criação e exibição de tours virtuais 360°.",
    section3: "3. Uso do Serviço",
    text3: "Você concorda em usar a plataforma de forma ética e profissional. Não é permitido o uso de imagens que não lhe pertençam ou para as cuales você não tenha direitos de distribuição.",
    section4: "4. Propriedade Intelectual",
    text4: "O software, diseño e marcas associadas ao Tour Weaver são de propriedade exclusiva da empresa. Os tours generados são de propriedade do cliente de acordo com o contrato de serviço específico."
  }
};

export default function TermsPage() {
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
              <FileText className="text-primary w-6 h-6" />
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

            <section>
              <h2 className="text-xl font-bold mb-4">{t.section4}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.text4}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
