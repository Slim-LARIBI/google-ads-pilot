'use client';

import Link from 'next/link';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import { ArrowRight, Shield, Zap, Search, BarChart3, Settings2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-200 blur-3xl opacity-60" />
        <div className="absolute top-40 -left-28 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-70" />
        <div className="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-gray-100 blur-3xl opacity-90" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Hero */}
        <div className="pt-6 pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Badge variant="P1">MVP</Badge>
            <span className="text-sm text-gray-500">
              Multi-module • SEA + SEO • Local first
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Marketing Command Center
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Une plateforme pour <span className="font-semibold">centraliser</span> tes actions marketing,
            transformer des insights en <span className="font-semibold">règles automatisées</span>,
            et garder un contrôle humain sur l’exécution.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* On garde des liens simples. On corrigera la navigation ensuite. */}
            <Link href="/sea/overview">
              <Button variant="primary" icon={<ArrowRight size={18} />}>
                Démarrer avec SEA
              </Button>
            </Link>

            <Link href="/seo/overview">
              <Button variant="secondary" icon={<Search size={18} />}>
                Explorer SEO
              </Button>
            </Link>
          </div>

          {/* Trust / highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary-600">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rapide à piloter</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Un cockpit clair : Overview, Rules, Alerts, Actions.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary-600">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Contrôle & sécurité</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Règles versionnées, activation/désactivation, et validations.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary-600">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Scalable</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Module SEA aujourd’hui, module SEO demain, Meta ensuite.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modules */}
        <div className="pb-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Choisis un module</h2>
              <p className="text-sm text-gray-600">
                Une navigation simple, des écrans prêts à présenter.
              </p>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Settings2 size={14} />
              <span>Build local • prêt pour prod plus tard</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">SEA (Google Ads)</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Rules engine + actions + alerting. Objectif : industrialiser la performance.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="P0">Rules CRUD</Badge>
                    <Badge variant="P1">Alerts</Badge>
                    <Badge variant="P2">Actions</Badge>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link href="/sea/overview">
                    <Button variant="primary" icon={<ArrowRight size={18} />}>
                      Ouvrir SEA
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Parfait pour une démo investisseur : “règles → décisions → exécution”.
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">SEO</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Overview (mock) + préparation Scan / Issues / Pages / Keywords.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="P1">Overview</Badge>
                    <Badge variant="P2">Scan</Badge>
                    <Badge variant="P2">Issues</Badge>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link href="/seo/overview">
                    <Button variant="secondary" icon={<Search size={18} />}>
                      Ouvrir SEO
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Prochain upgrade : “Run scan” → résultats → règles SEO automatiques.
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-6 border-t border-gray-200 pt-6 text-sm text-gray-500 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Marketing Command Center</span>
          <span>V1 • Local • Supabase ready</span>
        </div>
      </div>
    </div>
  );
}