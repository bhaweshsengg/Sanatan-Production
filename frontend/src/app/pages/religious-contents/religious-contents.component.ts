import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface ReligiousContentItem {
  id: string;
  title: string;
  sanskritTitle: string;
  category: 'Mantras' | 'Chalisas' | 'Stotrams' | 'Scriptures';
  deity: string;
  source: string;
  summary: string;
  sanskritText: string;
  transliteration: string;
  englishMeaning: string;
  significance: string;
  bestTimeToChant?: string;
  verses?: Array<{ sanskrit: string; transliteration: string; english: string }>;
}

@Component({
  selector: 'app-religious-contents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
      <!-- Sacred Header Banner -->
      <header class="bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 py-16 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-full mb-4 shadow-inner text-2xl">
            🕉️
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Religious Articles &amp; Sacred Wisdom</h1>
          <p class="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto font-light">
            Timeless prayers, Vedic mantras, stotrams, and sacred scriptures of Sanatan Dharma for daily spiritual practice
          </p>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-3xl mx-auto">
            <div class="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search mantras, stotrams, deities, Sanskrit text, or meaning..."
                class="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm"
                [(ngModel)]="searchTerm"
                (input)="filterContents()"
              />
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
              </svg>
            </div>
            <div class="relative w-full sm:w-auto min-w-[180px]">
              <select
                class="block w-full px-4 py-3 rounded-lg bg-white border border-transparent text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm font-medium cursor-pointer"
                [(ngModel)]="selectedCategory"
                (change)="filterContents()"
              >
                <option value="All">All Categories</option>
                <option value="Mantras">Mantras</option>
                <option value="Chalisas">Chalisas</option>
                <option value="Stotrams">Stotrams</option>
                <option value="Scriptures">Scriptures</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Category Quick Filter Pills & Quick Links -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-8 border-b border-gray-200 pb-4">
            <div class="flex flex-wrap items-center gap-2">
              <button
                *ngFor="let cat of categories"
                type="button"
                (click)="setCategory(cat)"
                class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm"
                [ngClass]="{
                  'bg-orange-600 text-white shadow-orange-200': selectedCategory === cat,
                  'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200': selectedCategory !== cat
                }"
              >
                {{ cat }}
              </button>
            </div>

            <!-- Link to Blog page -->
            <div class="flex items-center gap-2">
              <a
                routerLink="/blog"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium text-xs border border-gray-200 shadow-sm transition"
              >
                <span>📰</span>
                <span>Community Blog</span>
              </a>
              <a
                routerLink="/festival"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium text-xs border border-gray-200 shadow-sm transition"
              >
                <span>🪔</span>
                <span>Festivals</span>
              </a>
            </div>
          </div>

          <!-- Content Grid -->
          <div *ngIf="filteredContents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              *ngFor="let item of filteredContents"
              class="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div class="p-6">
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    [ngClass]="{
                      'bg-orange-100 text-orange-800': item.category === 'Mantras',
                      'bg-amber-100 text-amber-800': item.category === 'Chalisas',
                      'bg-red-100 text-red-800': item.category === 'Stotrams',
                      'bg-emerald-100 text-emerald-800': item.category === 'Scriptures'
                    }"
                  >
                    {{ item.category }}
                  </span>
                  <span class="text-xs text-gray-400 font-medium truncate max-w-[150px]">{{ item.deity }}</span>
                </div>

                <h3 class="text-lg font-bold text-gray-900 mb-1 hover:text-orange-600 transition-colors">
                  {{ item.title }}
                </h3>
                <p class="text-xs font-serif text-orange-800 mb-3 font-semibold">{{ item.sanskritTitle }}</p>
                <p class="text-xs text-gray-500 mb-4 line-clamp-2">{{ item.summary }}</p>

                <!-- Sanskrit Teaser Box -->
                <div class="bg-orange-50/60 rounded-xl p-3.5 border border-orange-100 mb-4 font-serif text-xs text-gray-900 leading-relaxed line-clamp-3">
                  {{ item.sanskritText }}
                </div>
              </div>

              <div class="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span class="text-xs text-gray-500 truncate max-w-[140px]">{{ item.source }}</span>
                <button
                  type="button"
                  (click)="openModal(item)"
                  class="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
                >
                  <span>Read Sacred Text</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredContents.length === 0" class="py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-lg mx-auto">
            <div class="text-4xl mb-3">🕉️</div>
            <h3 class="text-lg font-bold text-gray-900">No religious content found</h3>
            <p class="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              No hymns or scriptures match your current search or category filter. Try clearing your filters.
            </p>
            <button
              type="button"
              (click)="resetFilters()"
              class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </main>

      <!-- MODAL FOR DETAILED SACRED TEXT VIEW -->
      <div *ngIf="selectedItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-start justify-between border-b border-gray-100 p-6 bg-gradient-to-r from-orange-50 to-amber-50">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-200 text-orange-900">
                  {{ selectedItem.category }}
                </span>
                <span class="text-xs text-gray-500 font-medium">• {{ selectedItem.deity }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900">{{ selectedItem.title }}</h3>
              <p class="text-sm font-serif text-orange-900 font-semibold mt-0.5">{{ selectedItem.sanskritTitle }}</p>
            </div>
            <button
              type="button"
              (click)="closeModal()"
              class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Source & Timing -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div>
                <span class="text-gray-400 font-semibold uppercase tracking-wider block">Source</span>
                <span class="text-gray-800 font-medium">{{ selectedItem.source }}</span>
              </div>
              <div *ngIf="selectedItem.bestTimeToChant">
                <span class="text-gray-400 font-semibold uppercase tracking-wider block">Recommended Time</span>
                <span class="text-gray-800 font-medium">{{ selectedItem.bestTimeToChant }}</span>
              </div>
            </div>

            <!-- Sanskrit Text -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-xs font-bold uppercase tracking-wider text-orange-700 flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Mula Sanskrit Shloka</span>
                </h4>
                <button
                  type="button"
                  (click)="copyToClipboard(selectedItem.sanskritText, 'sanskrit')"
                  class="text-xs text-gray-500 hover:text-orange-600 flex items-center gap-1 transition"
                >
                  <span>{{ copiedId === 'sanskrit' ? 'Copied! ✓' : 'Copy Sanskrit' }}</span>
                </button>
              </div>
              <div class="bg-orange-50/70 border border-orange-200/80 rounded-xl p-4 text-center font-serif text-base sm:text-lg text-gray-900 whitespace-pre-line leading-relaxed shadow-inner">
                {{ selectedItem.sanskritText }}
              </div>
            </div>

            <!-- Transliteration -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Pronunciation / IAST Transliteration</h4>
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 italic whitespace-pre-line leading-relaxed">
                {{ selectedItem.transliteration }}
              </div>
            </div>

            <!-- English Meaning -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">English Translation &amp; Meaning</h4>
              <div class="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 text-sm text-gray-800 leading-relaxed">
                {{ selectedItem.englishMeaning }}
              </div>
            </div>

            <!-- Spiritual Significance -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Spiritual Significance &amp; Benefits</h4>
              <p class="text-xs text-gray-600 leading-relaxed">
                {{ selectedItem.significance }}
              </p>
            </div>

            <!-- Additional Verses (if present) -->
            <div *ngIf="selectedItem.verses && selectedItem.verses.length > 0" class="space-y-4 pt-4 border-t border-gray-200">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-700">Selected Sacred Verses</h4>
              <div *ngFor="let verse of selectedItem.verses; let i = index" class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <p class="font-serif text-sm font-semibold text-gray-900 whitespace-pre-line">{{ verse.sanskrit }}</p>
                <p class="text-xs text-gray-500 italic">{{ verse.transliteration }}</p>
                <p class="text-xs text-gray-700 font-medium">{{ verse.english }}</p>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-2 border-t border-gray-100 p-4 bg-gray-50">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReligiousContentsComponent {
  searchTerm = '';
  selectedCategory = 'All';
  selectedItem: ReligiousContentItem | null = null;
  copiedId: string | null = null;

  categories: string[] = ['All', 'Mantras', 'Chalisas', 'Stotrams', 'Scriptures'];

  items: ReligiousContentItem[] = [
    {
      id: 'gayatri-mantra',
      title: 'Maha Gayatri Mantra',
      sanskritTitle: 'महा गायत्री मन्त्र',
      category: 'Mantras',
      deity: 'Savitr / Devi Gayatri (Supreme Light)',
      source: 'Rigveda (Mandala 3, Sukta 62, Verse 10)',
      summary: 'The mother of all Vedic mantras, illuminating the intellect and awakening divine consciousness within the practitioner.',
      sanskritText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं ।\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
      transliteration: 'Oṁ Bhūr Bhuvaḥ Svaḥ Tat-Savitur Vareṇyaṁ |\nBhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt ||',
      englishMeaning: 'We meditate upon that supreme adorable solar splendor of the divine creator (Savitr); may that divine light illuminate and inspire our intellect and higher consciousness.',
      significance: 'Gayatri Mantra is considered the essence of the Vedas. Chanting it with focus calms the nervous system, stimulates the frontal cortex, dispels darkness of ignorance, and invokes profound spiritual intuition.',
      bestTimeToChant: 'Brahma Muhurta (dawn), midday (Madhyahna), and twilight (Sandhya)',
    },
    {
      id: 'maha-mrityunjaya',
      title: 'Maha Mrityunjaya Mantra',
      sanskritTitle: 'महा मृत्युञ्जय मन्त्र',
      category: 'Mantras',
      deity: 'Lord Shiva (Tryambaka)',
      source: 'Rigveda (Mandala 7, Sukta 59, Verse 12)',
      summary: 'The life-protecting conqueror of death mantra, seeking liberation from the fear of mortality and cyclic rebirth.',
      sanskritText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
      transliteration: 'Oṁ Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭi-Vardhanam |\nUrvārukam-Iva Bandhanān-Mṛtyor-Mukṣīya Māmṛtāt ||',
      englishMeaning: 'We worship the Three-Eyed Lord Shiva, who is fragrant and nourishes all beings. As a ripe cucumber is severed effortlessly from its stem, so may we be liberated from the bondage of death and delusion, and anchored in immortality.',
      significance: 'Revered across Sanatan tradition as a shield of healing, mental courage, and physical longevity. It dissolves fears, protects during crises, and leads the seeker toward self-realization.',
      bestTimeToChant: 'Early mornings, during illness or emotional distress, and Mondays',
    },
    {
      id: 'hanuman-chalisa',
      title: 'Shri Hanuman Chalisa',
      sanskritTitle: 'श्री हनुमान चालीसा',
      category: 'Chalisas',
      deity: 'Lord Hanuman (Pavanputra)',
      source: 'Composed by Goswami Tulsidas (Awadhi/Sanskrit roots)',
      summary: 'A 40-verse hymn in praise of Lord Hanuman, celebrating His unmatched devotion, strength, courage, and wisdom.',
      sanskritText: 'जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥\nराम दूत अतुलित बल धामा । अञ्जनि पुत्र पवनसुत नामा ॥',
      transliteration: 'Jaya Hanumāna Jñāna Guna Sāgara | Jaya Kapīsa Tihuṁ Loka Ujāgara ||\nRāma Dūta Atulita Bala Dhāmā | Añjani Putra Pavanasuta Nāmā ||',
      englishMeaning: 'Hail Hanuman, ocean of wisdom and virtue! Hail the King of Vanaras, who illuminates all three worlds! You are Lord Rama’s envoy, an abode of incomparable strength, born of Anjana, and praised as the Son of the Wind.',
      significance: 'Recited by millions across the globe for overcoming fear, anxiety, obstacles, and negative influences. It instills immense spiritual willpower, humbleness, and unwavering devotion (Bhakti).',
      bestTimeToChant: 'Tuesdays, Saturdays, Hanuman Jayanti, or whenever in need of strength',
    },
    {
      id: 'shiva-tandava',
      title: 'Shiva Tandava Stotram',
      sanskritTitle: 'शिव ताण्डव स्तोत्रम्',
      category: 'Stotrams',
      deity: 'Lord Shiva (Nataraja)',
      source: 'Composed by Ravana (Uttara Kanda tradition)',
      summary: 'A rhythmic and poetic hymn describing the divine cosmic dance (Tandava) of Mahadev with ecstatic devotion.',
      sanskritText: 'जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥',
      transliteration: 'Jaṭāṭavīgalajjalapravāhapāvitasthale\nGale\'valambya Lambitāṁ Bhujaṅgatuṅgamālikām |\nḌamaḍḍamaḍḍamaḍḍaman-Ninādavaḍḍamarvayaṁ\nCakāra Caṇḍatāṇḍavaṁ Tanotu Naḥ Śivaḥ Śivam ||',
      englishMeaning: 'With His sacred neck consecrated by the flow of water cascading from His dense matted hair, and adorned with a garland of serpents hanging around His neck, Lord Shiva performs His fierce Tandava to the rhythmic sound of damaru: may that Shiva bestow auspiciousness upon us!',
      significance: 'The stotram creates powerful resonant spiritual vibrations, removes inertia, and awakens profound reverence for Lord Shiva as the cosmic regenerator and ultimate consciousness.',
      bestTimeToChant: 'Mondays, Pradosh Vrat, and Maha Shivaratri',
    },
    {
      id: 'ganesh-atharvashirsha',
      title: 'Shri Ganesh Atharvashirsha & Shloka',
      sanskritTitle: 'श्री गणेश अथर्वशीर्ष एवं श्लोक',
      category: 'Mantras',
      deity: 'Lord Ganesha (Vighnaharta)',
      source: 'Atharvaveda (Ganapati Upanishad)',
      summary: 'Sacred invocation to Lord Ganesha, the embodiment of wisdom, auspicious beginnings, and remover of all obstacles.',
      sanskritText: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
      transliteration: 'Vakratuṇḍa Mahākāya Sūryakoṭi Samaprabha |\nNirvighnaṁ Kuru Me Deva Sarvakāryeṣu Sarvadā ||',
      englishMeaning: 'O Lord with the curved trunk and immense cosmic form, whose brilliance equals millions of suns: please make all my endeavors free from obstacles, always and forever.',
      significance: 'Chanted at the inception of all auspicious endeavors, ceremonies, examinations, business launches, and daily prayers to invoke clarity, blessing, and unobstructed success.',
      bestTimeToChant: 'Every morning and before beginning any new task or voyage',
    },
    {
      id: 'bhagavad-gita-teachings',
      title: 'Shrimad Bhagavad Gita Guide',
      sanskritTitle: 'श्रीमद्भगवद्गीता सार',
      category: 'Scriptures',
      deity: 'Lord Krishna & Arjuna',
      source: 'Mahabharata (Bhishma Parva, Chapters 23–40)',
      summary: 'The timeless dialogue on duty, spiritual realization, selflessness, and liberation delivered by Lord Krishna on the battlefield of Kurukshetra.',
      sanskritText: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
      transliteration: 'Karmaṇyevādhikāraste Mā Phaleṣu Kadācana |\nMā Karmaphalaheturbhūrmā Te Saṅgo\'stvakarmaṇi ||',
      englishMeaning: 'You have a right only to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.',
      significance: 'The Gita is the crest-jewel of Vedic philosophy, harmonizing Karma Yoga (selfless action), Bhakti Yoga (loving devotion), and Jnana Yoga (spiritual knowledge) to guide human life through every crisis.',
      bestTimeToChant: 'Daily study and contemplation',
      verses: [
        {
          sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
          transliteration: 'Yadā yadā hi dharmasya glānirbhavati bhārata | Abhyutthānamadharmasya tadātmānaṁ sṛjāmyaham ||',
          english: 'Whenever there is a decline in righteousness and rise in unrighteousness, O Arjuna, at that time I manifest Myself.'
        },
        {
          sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
          transliteration: 'Sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja | Ahaṁ tvāṁ sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
          english: 'Abandon all varieties of dharmas and surrender unto Me alone. I shall deliver you from all sinful reactions; do not grieve.'
        }
      ]
    },
    {
      id: 'durga-stuti',
      title: 'Ya Devi Sarvabhuteshu (Durga Stuti)',
      sanskritTitle: 'या देवी सर्वभूतेषु (दुर्गा स्तुति)',
      category: 'Stotrams',
      deity: 'Maa Durga / Adishakti',
      source: 'Devi Mahatmyam / Markandeya Purana (Aparajita Stuti)',
      summary: 'Sacred hymn praising the divine mother as the supreme consciousness dwelling in all beings in various divine aspects.',
      sanskritText: 'या देवी सर्वभूतेषु शक्ति-रूपेण संस्थिता ।\nनमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥',
      transliteration: 'Yā Devī Sarvabhūteṣu Śakti-Rūpeṇa Saṁsthitā |\nNamastasyai Namastasyai Namastasyai Namo Namaḥ ||',
      englishMeaning: 'To the Divine Goddess who abides in all living beings in the form of Power and Energy: salutations to Her, salutations to Her, salutations to Her, repeated salutations.',
      significance: 'Chanted during Navratri and daily worship to honor the primordial feminine energy (Shakti) that sustains, protects, and enlightens the universe.',
      bestTimeToChant: 'Fridays, Navratri, and evening Aarti',
    }
  ];

  filteredContents: ReligiousContentItem[] = [...this.items];

  setCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filterContents();
  }

  filterContents(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const cat = this.selectedCategory;

    this.filteredContents = this.items.filter((item) => {
      const catMatch = cat === 'All' || item.category === cat;
      const termMatch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.sanskritTitle.toLowerCase().includes(term) ||
        item.deity.toLowerCase().includes(term) ||
        item.sanskritText.toLowerCase().includes(term) ||
        item.englishMeaning.toLowerCase().includes(term) ||
        item.transliteration.toLowerCase().includes(term);

      return catMatch && termMatch;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.filterContents();
  }

  openModal(item: ReligiousContentItem): void {
    this.selectedItem = item;
  }

  closeModal(): void {
    this.selectedItem = null;
    this.copiedId = null;
  }

  copyToClipboard(text: string, id: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copiedId = id;
        setTimeout(() => {
          if (this.copiedId === id) this.copiedId = null;
        }, 2500);
      });
    }
  }
}
