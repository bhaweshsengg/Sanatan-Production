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
          <h1 class="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Sanatan Religious Contents</h1>
          <p class="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto font-light">
            Explore sacred Vedic mantras, chalisas, devotional stotrams, and eternal scriptures of Sanatan Dharma
          </p>

          <!-- Search & Filter Controls -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
            <div class="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search by mantra name, deity, Sanskrit text, or meaning..."
                class="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 border border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm"
                [(ngModel)]="searchTerm"
                (input)="filterContents()"
              />
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path>
              </svg>
            </div>
            <div class="relative w-full sm:w-auto min-w-[200px]">
              <select
                class="block w-full px-4 py-3 rounded-lg bg-white border border-transparent text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors text-sm font-medium cursor-pointer"
                [(ngModel)]="selectedCategory"
                (change)="filterContents()"
              >
                <option value="All">All Categories</option>
                <option value="Mantras">Sacred Mantras</option>
                <option value="Chalisas">Chalisas</option>
                <option value="Stotrams">Devotional Stotrams</option>
                <option value="Scriptures">Sacred Scriptures</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Container -->
      <main class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Summary & Quick Navigation -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ filteredContents.length }} {{ filteredContents.length === 1 ? 'Sacred Text' : 'Sacred Texts' }} Available
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">
                Authentic scriptures, shlokas, and devotional prayers for daily recitation
              </p>
            </div>
            <div class="flex items-center gap-2">
              <a
                routerLink="/panchang"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <span>📅</span>
                <span>Live Panchang</span>
              </a>
              <a
                routerLink="/festival"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium text-xs border border-gray-300 transition shadow-sm"
              >
                <span>🪔</span>
                <span>Festival Calendar</span>
              </a>
            </div>
          </div>

          <!-- Category Filter Pills -->
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              *ngFor="let cat of categories"
              (click)="setCategory(cat)"
              class="px-4 py-1.5 rounded-full text-xs font-semibold transition shadow-sm"
              [ngClass]="selectedCategory === cat ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredContents.length === 0" class="py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-xl mx-auto">
            <div class="text-5xl mb-4">🕉️</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">No Contents Found</h3>
            <p class="text-gray-500 mb-6 text-sm">
              No religious texts matched your search query. Try clearing your search term or selecting a different category.
            </p>
            <button
              (click)="resetFilters()"
              class="px-4 py-2 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition"
            >
              Reset Filters
            </button>
          </div>

          <!-- Content Cards Grid -->
          <div *ngIf="filteredContents.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              *ngFor="let item of filteredContents"
              class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div class="p-6">
                <!-- Header with Category & Deity -->
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-orange-200/70">
                    {{ item.category }}
                  </span>
                  <span class="text-xs text-gray-500 font-medium truncate">
                    {{ item.deity }}
                  </span>
                </div>

                <!-- Title & Sanskrit Name -->
                <h3 class="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                  {{ item.title }}
                </h3>
                <p class="text-sm font-serif text-orange-700 font-semibold mb-4">
                  {{ item.sanskritTitle }}
                </p>

                <!-- Sanskrit Shloka Box -->
                <div class="bg-orange-50/70 border border-orange-100 rounded-xl p-4 mb-4 text-center relative group/box">
                  <p class="font-serif text-base text-orange-950 leading-relaxed whitespace-pre-line font-medium">
                    {{ item.sanskritText }}
                  </p>
                  <button
                    type="button"
                    (click)="copyToClipboard(item.sanskritText, item.id)"
                    class="absolute top-2 right-2 text-xs bg-white/80 hover:bg-white text-orange-700 border border-orange-200 px-2 py-0.5 rounded shadow-sm transition"
                    title="Copy Sanskrit Verse"
                  >
                    {{ copiedId === item.id ? '✓ Copied' : '📋 Copy' }}
                  </button>
                </div>

                <!-- Transliteration -->
                <div class="mb-3">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Transliteration:</h4>
                  <p class="text-xs text-gray-600 italic leading-relaxed">
                    {{ item.transliteration }}
                  </p>
                </div>

                <!-- English Meaning -->
                <div class="mb-3">
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Meaning:</h4>
                  <p class="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                    {{ item.englishMeaning }}
                  </p>
                </div>

                <!-- Source & Recitation Timing -->
                <div class="pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between gap-2">
                  <span class="truncate">📖 {{ item.source }}</span>
                  <span *ngIf="item.bestTimeToChant" class="truncate text-orange-600 font-medium">
                    ⏰ {{ item.bestTimeToChant }}
                  </span>
                </div>
              </div>

              <!-- Card Action -->
              <div class="p-6 pt-0">
                <button
                  type="button"
                  (click)="openModal(item)"
                  class="w-full inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition shadow-sm"
                >
                  <span>📖</span>
                  <span>Read Full Sacred Text &amp; Significance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Detail Modal -->
      <div
        *ngIf="selectedItem"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        (click)="closeModal()"
      >
        <div
          class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8 relative max-h-[90vh] flex flex-col"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white flex-shrink-0 relative">
            <button
              type="button"
              (click)="closeModal()"
              class="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition focus:outline-none"
              aria-label="Close modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <span class="inline-block bg-white/20 backdrop-blur-sm text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
              {{ selectedItem.category }} · {{ selectedItem.deity }}
            </span>
            <h3 class="text-2xl font-bold">{{ selectedItem.title }}</h3>
            <p class="text-lg font-serif text-orange-100 font-semibold mt-1">{{ selectedItem.sanskritTitle }}</p>
          </div>

          <!-- Modal Body -->
          <div class="p-6 md:p-8 overflow-y-auto space-y-6 flex-grow">
            <!-- Sanskrit Verse Box -->
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center relative">
              <p class="font-serif text-lg md:text-xl text-orange-950 font-bold leading-relaxed whitespace-pre-line">
                {{ selectedItem.sanskritText }}
              </p>
              <button
                type="button"
                (click)="copyToClipboard(selectedItem.sanskritText, 'modal')"
                class="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-700 border border-orange-300 rounded-lg text-xs font-semibold hover:bg-orange-100 transition shadow-sm"
              >
                {{ copiedId === 'modal' ? '✓ Copied to Clipboard' : '📋 Copy Sanskrit Verse' }}
              </button>
            </div>

            <!-- Transliteration -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sanskrit Transliteration:</h4>
              <p class="text-sm text-gray-700 italic leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                {{ selectedItem.transliteration }}
              </p>
            </div>

            <!-- English Meaning -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">English Meaning &amp; Translation:</h4>
              <p class="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                {{ selectedItem.englishMeaning }}
              </p>
            </div>

            <!-- Spiritual Significance -->
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Spiritual Significance &amp; Practice:</h4>
              <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {{ selectedItem.significance }}
              </p>
            </div>

            <!-- Additional Verses (if any) -->
            <div *ngIf="selectedItem.verses && selectedItem.verses.length > 0" class="space-y-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500">Key Verses &amp; Stanzas:</h4>
              <div *ngFor="let verse of selectedItem.verses; let i = index" class="p-4 bg-orange-50/50 rounded-xl border border-orange-100 space-y-2">
                <p class="font-serif text-sm font-bold text-orange-950">{{ verse.sanskrit }}</p>
                <p class="text-xs italic text-gray-600">{{ verse.transliteration }}</p>
                <p class="text-xs text-gray-700">{{ verse.english }}</p>
              </div>
            </div>

            <!-- Metadata Box -->
            <div class="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4 text-xs text-gray-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="font-semibold text-gray-900">Scriptural Source:</span> {{ selectedItem.source }}
              </div>
              <div *ngIf="selectedItem.bestTimeToChant">
                <span class="font-semibold text-gray-900">Auspicious Timing:</span> {{ selectedItem.bestTimeToChant }}
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <span class="text-xs text-gray-500">Om Shanti Shanti Shanti 🕉️</span>
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReligiousContentsComponent {
  categories: Array<'All' | 'Mantras' | 'Chalisas' | 'Stotrams' | 'Scriptures'> = [
    'All',
    'Mantras',
    'Chalisas',
    'Stotrams',
    'Scriptures',
  ];

  selectedCategory: string = 'All';
  searchTerm: string = '';
  selectedItem: ReligiousContentItem | null = null;
  copiedId: string | null = null;

  items: ReligiousContentItem[] = [
    {
      id: 'gayatri-mantra',
      title: 'Gayatri Mantra',
      sanskritTitle: 'गायत्री मन्त्र',
      category: 'Mantras',
      deity: 'Savita / Goddess Gayatri',
      source: 'Rigveda (Mandala 3, Sukta 62, Verse 10)',
      summary: 'The supreme universal prayer of Sanatan Dharma for illumination of intellect and divine wisdom.',
      sanskritText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
      transliteration: 'Om Bhur Bhuvaḥ Svaḥ Tat Savitur Vareṇyaṁ\nBhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt ||',
      englishMeaning: 'We meditate upon the supreme effulgent divine light of Savita (the cosmic creator and solar source). May that divine light illuminate and inspire our intellect and consciousness.',
      significance: 'Gayatri Mantra is revered as the mother of all Vedic mantras. Regular chanting enhances mental clarity, purifies thoughts, bestows spiritual wisdom, and awakens supreme divine consciousness.',
      bestTimeToChant: 'Brahma Muhurta (dawn), midday, and dusk (Sandhya)',
    },
    {
      id: 'maha-mrityunjaya',
      title: 'Maha Mrityunjaya Mantra',
      sanskritTitle: 'महामृत्युञ्जय मन्त्र',
      category: 'Mantras',
      deity: 'Lord Shiva (Mahadev)',
      source: 'Rigveda (Mandala 7, Sukta 59, Verse 12)',
      summary: 'The life-protecting conqueror of death mantra dedicated to the three-eyed Lord Shiva for healing and liberation.',
      sanskritText: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात् ॥',
      transliteration: 'Om Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭivardhanam |\nUrvārukamiva Bandhanān Mṛtyormukṣīya Māmṛtāt ||',
      englishMeaning: 'We worship the Three-Eyed Lord Shiva, who is fragrant and nourishes all beings. Just as a ripe cucumber effortlessly detaches from the vine, may He liberate us from death and bondage to bestow immortality.',
      significance: 'Known as the Moksha and healing mantra. Devotees chant it 108 times for physical well-being, freedom from fear, overcoming grave obstacles, and attaining spiritual liberation.',
      bestTimeToChant: 'Early morning or during evening Shiva Puja',
    },
    {
      id: 'hanuman-chalisa',
      title: 'Shri Hanuman Chalisa',
      sanskritTitle: 'श्री हनुमान चालीसा',
      category: 'Chalisas',
      deity: 'Lord Hanuman (Pawanputra)',
      source: 'Composed by Goswami Tulsidas (Awadhi/Hindi)',
      summary: 'Forty sacred chaupais celebrating the boundless devotion, strength, intellect, and protection of Lord Hanuman.',
      sanskritText: 'जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥\nराम दूत अतुलित बल धामा । अञ्जनि पुत्र पवनसुत नामा ॥',
      transliteration: 'Jaya Hanumāna Jñāna Guna Sāgara | Jaya Kapīsa Tihu Lok Ujāgara ||\nRāma Dūta Atulita Bala Dhāmā | Añjani Putra Pawanasuta Nāmā ||',
      englishMeaning: 'Victory to Hanuman, ocean of divine wisdom and virtuous qualities! Victory to the lord among vanaras, who illuminates the three worlds! Messenger of Lord Rama, abode of incomparable strength, son of Anjani and known as Pawansuta.',
      significance: 'Reciting Hanuman Chalisa dispels negativity, instills courage, removes fear of evil forces, and deepens unshakeable devotion to Lord Rama. It is recited daily by millions of devotees globally.',
      bestTimeToChant: 'Tuesdays, Saturdays, or daily morning and evening',
      verses: [
        {
          sanskrit: 'सब सुख लहै तुम्हारी सरना । तुम रक्षक काहू को डर ना ॥',
          transliteration: 'Saba sukha lahai tumhārī saranā | Tuma rakṣaka kāhū ko ḍara nā ||',
          english: 'All happiness and peace reside in Your shelter; when You are the protector, what fear can there ever be?'
        },
        {
          sanskrit: 'संकट कटै मिटै सब पीरा । जो सुमिरै हनुमत बलबीरा ॥',
          transliteration: 'Saṅkaṭa kaṭai miṭai saba pīrā | Jo sumirai Hanumata balabīrā ||',
          english: 'All suffering is severed and all pain dissolves for one who remembers the valiant and heroic Hanuman.'
        }
      ]
    },
    {
      id: 'shiv-tandav-stotram',
      title: 'Shiva Tandava Stotram',
      sanskritTitle: 'शिव ताण्डव स्तोत्रम्',
      category: 'Stotrams',
      deity: 'Lord Shiva',
      source: 'Composed by King Ravana (Uttara Kanda tradition)',
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
