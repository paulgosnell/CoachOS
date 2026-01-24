import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ArticleLayout } from '@/components/blog/ArticleLayout'
import { getArticleBySlug, articles } from '@/lib/content/articles'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.metaTitle || `${article.title} | Coach OS`,
    description: article.metaDescription || article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // In a real implementation, you would fetch MDX content here
  // For now, we'll render placeholder content based on the article type
  return (
    <ArticleLayout article={article}>
      <ArticleContent slug={slug} />
    </ArticleLayout>
  )
}

// Content components - replace with MDX loader in production
function ArticleContent({ slug }: { slug: string }) {
  const contentMap: Record<string, React.ReactNode> = {
    // ADHD Business
    'adhd-entrepreneur-guide': <ADHDEntrepreneurGuide />,
    'why-productivity-advice-fails-adhd': <WhyProductivityFailsADHD />,
    'adhd-accountability': <ADHDAccountability />,
    'adhd-time-blindness-business': <ADHDTimeBlindness />,
    // ADHD Productivity
    'adhd-task-management-systems': <ADHDTaskManagementGuide />,
    'adhd-decision-fatigue': <ADHDDecisionFatigueGuide />,
    'adhd-overwhelm-spiral': <ADHDOverwhelmSpiral />,
    // Coaching
    'executive-coaching-cost-2025': <ExecutiveCoachingCostGuide />,
    'ai-coaching-vs-human-coaching': <AIvsHumanCoaching />,
    'coaching-vs-therapy': <CoachingVsTherapy />,
    // Frameworks
    'grow-coaching-model-adhd': <GROWModelGuide />,
    'coaching-frameworks-entrepreneurs': <CoachingFrameworks />,
    // Founder Life
    'founder-loneliness': <FounderLonelinessGuide />,
    'decision-making-founders': <DecisionMakingFounders />,
  }

  return contentMap[slug] || <PlaceholderContent />
}

function PlaceholderContent() {
  return (
    <div className="text-silver-light">
      <p>Content coming soon.</p>
    </div>
  )
}

function ADHDEntrepreneurGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        If you have ADHD, you are <strong className="text-white">300% more likely to start your own business</strong>.
        That is not a typo. The same traits that make traditional employment challenging can make you an exceptional entrepreneur.
      </p>

      <h2 className="text-2xl font-bold text-white">Why ADHD Brains Excel at Entrepreneurship</h2>
      <p>
        The ADHD brain is wired differently. Where neurotypical minds see obstacles, we see opportunities.
        Our hyperfocus, when channeled correctly, can accomplish in hours what takes others days.
        Our risk tolerance helps us make the bold moves that startups require.
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Creativity and innovation</strong> - We connect dots others do not see</li>
        <li><strong className="text-silver">Hyperfocus</strong> - When engaged, we can work with intense concentration</li>
        <li><strong className="text-silver">Risk tolerance</strong> - Impulsivity becomes willingness to take chances</li>
        <li><strong className="text-silver">Resilience</strong> - Years of overcoming challenges builds mental toughness</li>
        <li><strong className="text-silver">Quick thinking</strong> - We stay calm in chaotic situations</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Real Challenges (And How to Address Them)</h2>

      <h3 className="text-xl font-semibold text-silver">1. Task Initiation</h3>
      <p>
        You know exactly what needs to be done. You just cannot start. This is not laziness - it is a
        neurological difference in how our brains process motivation and reward.
      </p>
      <p>
        <strong className="text-silver">Solution:</strong> External accountability. Whether it is a coach, body double,
        or AI assistant that captures your commitments, having someone or something to answer to
        makes starting dramatically easier.
      </p>

      <h3 className="text-xl font-semibold text-silver">2. Time Blindness</h3>
      <p>
        The ADHD brain processes time as either "now" or "not now". There is no middle ground.
        This makes planning, estimating task duration, and meeting deadlines genuinely difficult.
      </p>
      <p>
        <strong className="text-silver">Solution:</strong> External systems that make time visible. Visual timers,
        calendar blocking, and deadline reminders from tools (not your own memory) are essential.
      </p>

      <h3 className="text-xl font-semibold text-silver">3. Forgetting Everything</h3>
      <p>
        Great idea at 2am? Gone by morning. Commitment made in a meeting? Lost by end of day.
        ADHD working memory is limited, and information slips away before we can act on it.
      </p>
      <p>
        <strong className="text-silver">Solution:</strong> Capture systems that work automatically. Task extraction
        that pulls action items from conversations. A coach that remembers what you said and follows up.
      </p>

      <h2 className="text-2xl font-bold text-white">Systems That Work</h2>
      <p>
        Traditional productivity advice fails ADHD entrepreneurs because it assumes consistent motivation
        and reliable memory. Instead, build systems that work with your brain:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">One non-negotiable task per day</strong> - Set the bar low to build momentum</li>
        <li><strong className="text-silver">External accountability</strong> - Coaches, partners, or tools that check in</li>
        <li><strong className="text-silver">Automatic task capture</strong> - Stop relying on memory</li>
        <li><strong className="text-silver">Batching similar tasks</strong> - Reduce context switching costs</li>
        <li><strong className="text-silver">Body doubling</strong> - Work alongside others, even virtually</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Getting Support</h2>
      <p>
        Human executive coaches charge £300-500 per session. They are often unavailable when you need them most
        (like at 11pm when anxiety hits). AI coaching offers an alternative: framework-based guidance,
        automatic task extraction, and availability whenever you need it.
      </p>
      <p>
        The key is finding support that understands ADHD - not generic advice that assumes neurotypical patterns.
      </p>
    </div>
  )
}

function GROWModelGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        The GROW model is the most widely used coaching framework in the world. Developed in the 1980s by
        Sir John Whitmore, it provides a simple but powerful structure for goal setting and problem solving.
      </p>

      <h2 className="text-2xl font-bold text-white">What is GROW?</h2>
      <p>
        GROW is an acronym that guides a coaching conversation through four stages:
      </p>

      <div className="rounded-xl bg-titanium-800 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">G - Goal</h3>
          <p>What do you want to achieve? Define the purpose and desired outcome of the conversation.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">R - Reality</h3>
          <p>What is happening now? Assess the current situation with facts and honest reflection.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">O - Options</h3>
          <p>What could you do? Brainstorm possible approaches without judgement.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">W - Will / Way Forward</h3>
          <p>What will you do? Commit to specific actions with deadlines.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white">GROW for ADHD Brains</h2>
      <p>
        The GROW model works particularly well for ADHD entrepreneurs because it provides external structure.
        However, some adaptations help:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Keep goals small and immediate</strong> - Big goals trigger overwhelm</li>
        <li><strong className="text-silver">Spend more time on Reality</strong> - ADHD brains often skip assessment</li>
        <li><strong className="text-silver">Limit options to 3-4</strong> - Too many choices cause paralysis</li>
        <li><strong className="text-silver">Capture commitments externally</strong> - Do not rely on memory for the Will stage</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Sample GROW Questions</h2>
      <p>A good coach guides through questions, not instructions:</p>

      <h3 className="text-xl font-semibold text-silver">Goal Questions</h3>
      <ul className="list-disc space-y-1 pl-6">
        <li>What would you like to focus on today?</li>
        <li>What would make this conversation valuable?</li>
        <li>If we solve this, what changes?</li>
      </ul>

      <h3 className="text-xl font-semibold text-silver">Reality Questions</h3>
      <ul className="list-disc space-y-1 pl-6">
        <li>What is actually happening right now?</li>
        <li>What have you already tried?</li>
        <li>What is getting in the way?</li>
      </ul>

      <h3 className="text-xl font-semibold text-silver">Options Questions</h3>
      <ul className="list-disc space-y-1 pl-6">
        <li>What are your options?</li>
        <li>What else could you do?</li>
        <li>What would you advise a friend in this situation?</li>
      </ul>

      <h3 className="text-xl font-semibold text-silver">Will Questions</h3>
      <ul className="list-disc space-y-1 pl-6">
        <li>What will you do first?</li>
        <li>When will you do it?</li>
        <li>What might get in the way, and how will you handle that?</li>
      </ul>
    </div>
  )
}

function ExecutiveCoachingCostGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Executive coaching delivers real results - studies show ROI of $7.90 for every $1 invested.
        But the costs can be prohibitive. Here is what you are actually paying for.
      </p>

      <h2 className="text-2xl font-bold text-white">What Executive Coaching Costs in 2025</h2>

      <div className="rounded-xl bg-titanium-800 p-6 space-y-4">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Hourly rate (average)</span>
          <span className="font-bold text-white">£300-500</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Monthly session</span>
          <span className="font-bold text-white">£300-500/month</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>6-month program</span>
          <span className="font-bold text-white">£5,000-15,000</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>C-suite specialist</span>
          <span className="font-bold text-white">£800-1,500/hour</span>
        </div>
        <div className="flex justify-between">
          <span>Annual investment (monthly sessions)</span>
          <span className="font-bold text-white">£3,600-6,000/year</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white">What You Get (And Do Not Get)</h2>
      <p>Human executive coaching provides:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Deep expertise and pattern recognition</li>
        <li>Empathetic human connection</li>
        <li>Accountability between sessions</li>
        <li>Framework-based guidance</li>
      </ul>
      <p>But there are limitations:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Scheduled weeks in advance - no help when you need it now</li>
        <li>Limited recall of past conversations</li>
        <li>No task extraction or follow-up between sessions</li>
        <li>Price excludes most people who need coaching</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">AI Coaching: A Real Alternative?</h2>
      <p>
        AI coaching has matured significantly. Modern AI coaches can apply frameworks like GROW,
        maintain context across conversations, and extract action items automatically.
      </p>
      <p>At 1/10th to 1/100th the cost, AI coaching makes executive-level guidance accessible to:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Early-stage founders without big budgets</li>
        <li>Managers who want to develop but cannot justify £500/session</li>
        <li>Executives who need support between human coaching sessions</li>
        <li>Anyone who needs help at 11pm, not next Tuesday</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Making the Choice</h2>
      <p>
        Human coaching and AI coaching are not mutually exclusive. Many leaders use both:
        monthly sessions with a human coach for deep work, and AI coaching for daily support,
        quick decisions, and accountability between sessions.
      </p>
    </div>
  )
}

function ADHDTaskManagementGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Traditional to-do list systems assume reliable memory and consistent motivation.
        ADHD brains have neither. Here are systems designed for how you actually think.
      </p>

      <h2 className="text-2xl font-bold text-white">Why Normal To-Do Lists Fail</h2>
      <p>
        To-do lists are just externalized memory. But ADHD brains struggle with:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Task initiation</strong> - Seeing the list does not mean starting</li>
        <li><strong className="text-silver">Prioritization</strong> - Everything feels equally urgent (or not urgent at all)</li>
        <li><strong className="text-silver">Time estimation</strong> - Tasks take longer than expected</li>
        <li><strong className="text-silver">Out of sight, out of mind</strong> - Lists in apps get forgotten</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">5 Systems That Work</h2>

      <h3 className="text-xl font-semibold text-silver">1. The One Thing Method</h3>
      <p>
        Each day, identify ONE non-negotiable task. If that one thing gets done, the day is a success.
        This reduces overwhelm and builds momentum. Usually, once you start, you do more.
      </p>

      <h3 className="text-xl font-semibold text-silver">2. Brain Dump + Daily Transfer</h3>
      <p>
        Keep a running list where you capture everything. Daily, transfer just 3-5 items to a fresh
        daily list. The big list is for capture, the small list is for action.
      </p>

      <h3 className="text-xl font-semibold text-silver">3. Visual Task Boards</h3>
      <p>
        Physical whiteboards or Kanban boards keep tasks visible. ADHD brains forget what they cannot see.
        Sticky notes, Trello boards, or a whiteboard by your desk can help.
      </p>

      <h3 className="text-xl font-semibold text-silver">4. Body Doubling</h3>
      <p>
        Work alongside someone else - in person or virtually. Apps like Focusmate pair you with
        accountability partners for 50-minute work sessions. The presence of another person
        makes starting and focusing dramatically easier.
      </p>

      <h3 className="text-xl font-semibold text-silver">5. Automatic Task Extraction</h3>
      <p>
        The best system is one you do not have to maintain. Tools that automatically capture
        commitments from conversations mean you never forget what you said you would do.
        Coaching sessions become action items without extra work.
      </p>

      <h2 className="text-2xl font-bold text-white">The Key Principle</h2>
      <p>
        No system will fix your life. The goal is "good enough" - a system that captures most things
        and helps you act on the important ones. Perfectionism about systems is another form of procrastination.
      </p>
    </div>
  )
}

function ADHDDecisionFatigueGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Decision fatigue affects everyone. But for ADHD brains, the cognitive burden of choice
        is particularly heavy. Understanding why helps you protect your mental energy.
      </p>

      <h2 className="text-2xl font-bold text-white">Why Decisions Hit Harder with ADHD</h2>
      <p>
        Your prefrontal cortex - the brain region responsible for decision-making - functions differently
        with ADHD. Brain scans show increased activation across multiple regions during decision tasks,
        meaning your brain works harder for the same cognitive output.
      </p>
      <p>
        Dopamine dysregulation compounds this. Making decisions depletes dopamine faster than in
        neurotypical brains, leaving you mentally exhausted earlier in the day.
      </p>

      <h2 className="text-2xl font-bold text-white">Strategies That Help</h2>

      <h3 className="text-xl font-semibold text-silver">1. Reduce Options</h3>
      <p>
        Fewer choices mean less depletion. Capsule wardrobes, recurring meals, and standardized
        routines eliminate daily decisions that drain your reserves.
      </p>

      <h3 className="text-xl font-semibold text-silver">2. Create Default Decisions</h3>
      <p>
        Pre-decide recurring situations. "When X happens, I do Y." Remove the need to think
        about routine choices.
      </p>

      <h3 className="text-xl font-semibold text-silver">3. Set Decision Deadlines</h3>
      <p>
        Perfectionism extends decision time. Give yourself a deadline - even an arbitrary one -
        to prevent overthinking. A good decision now beats a perfect decision never.
      </p>

      <h3 className="text-xl font-semibold text-silver">4. Schedule Important Decisions Early</h3>
      <p>
        Cognitive resources are highest in the morning for most people. Save major decisions
        for when you have full capacity.
      </p>

      <h3 className="text-xl font-semibold text-silver">5. Use Decision Frameworks</h3>
      <p>
        Frameworks like GROW or simple pros/cons lists externalize the thinking process.
        When the structure is provided, your brain does not have to create it.
      </p>

      <h3 className="text-xl font-semibold text-silver">6. Get External Input</h3>
      <p>
        Talking through decisions with a coach, advisor, or even AI helps process options
        without carrying the full cognitive load yourself.
      </p>

      <h2 className="text-2xl font-bold text-white">Let Go of Perfectionism</h2>
      <p>
        The pursuit of the best decision is mentally taxing. Most decisions are reversible.
        Focus on "good enough" rather than optimal, and save your mental energy for what truly matters.
      </p>
    </div>
  )
}

function FounderLonelinessGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        55% of CEOs experienced mental health issues in 2024 - a 24 percentage point increase from the previous year.
        The isolation at the top is not weakness. It is structural.
      </p>

      <h2 className="text-2xl font-bold text-white">Why Founders Feel Alone</h2>
      <p>
        Leadership creates isolation by design:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Hierarchy</strong> - Being the boss makes friendship with reports complicated</li>
        <li><strong className="text-silver">Burden of decisions</strong> - Some things you cannot share with your team</li>
        <li><strong className="text-silver">Expectations</strong> - Investors, employees, and partners all need you to project confidence</li>
        <li><strong className="text-silver">Few true peers</strong> - Other founders understand, but competition can limit openness</li>
        <li><strong className="text-silver">Rare honest feedback</strong> - People filter what they tell the CEO</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Numbers Are Sobering</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>27% of entrepreneurs struggle with loneliness and isolation</li>
        <li>81% of founders are not open about their stressors</li>
        <li>Younger founders (under 34) are hit hardest - 30.7% report struggling</li>
        <li>Average loneliness rating among founders: 7.6 out of 10</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">What Actually Helps</h2>

      <h3 className="text-xl font-semibold text-silver">Peer Networks</h3>
      <p>
        CEO groups like YPO exist for a reason. Having 2-3 fellow founders you can be completely
        vulnerable with - outside your company, with no agenda - is invaluable.
      </p>

      <h3 className="text-xl font-semibold text-silver">Trusted Advisors</h3>
      <p>
        Build a small group of people who will give you honest, unvarnished feedback.
        Board members, mentors, or coaches who understand leadership challenges.
      </p>

      <h3 className="text-xl font-semibold text-silver">Professional Support</h3>
      <p>
        Therapy offers structured space to process feelings. Coaching provides strategic thinking
        partnership. Neither is weakness - both are tools high performers use.
      </p>

      <h3 className="text-xl font-semibold text-silver">24/7 Access</h3>
      <p>
        Some of the hardest moments come at 11pm or 3am. Having someone or something available
        outside business hours - whether a trusted friend, therapist on-call, or AI coach -
        ensures you are never truly alone with your thoughts.
      </p>

      <h2 className="text-2xl font-bold text-white">You Are Not Alone in Feeling Alone</h2>
      <p>
        The isolation you feel is shared by most founders. Acknowledging it is the first step.
        Building support structures is the second. You do not have to carry everything yourself.
      </p>
    </div>
  )
}

function WhyProductivityFailsADHD() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        You have tried Pomodoro. GTD. Time blocking. Eat the frog. Every productivity system
        recommended by successful entrepreneurs. None of it sticks. Here is why.
      </p>

      <h2 className="text-2xl font-bold text-white">The Problem with Standard Productivity Advice</h2>
      <p>
        Most productivity systems were designed by neurotypical people, for neurotypical brains.
        They assume consistent motivation, reliable memory, and linear time perception.
        ADHD brains have none of these.
      </p>

      <h3 className="text-xl font-semibold text-silver">Assumption 1: Motivation is Consistent</h3>
      <p>
        Standard advice says "just do the important things first" or "discipline beats motivation."
        But ADHD brains run on an interest-based nervous system. We cannot force engagement with
        tasks that do not stimulate us - no amount of willpower changes brain chemistry.
      </p>

      <h3 className="text-xl font-semibold text-silver">Assumption 2: Memory is Reliable</h3>
      <p>
        "Write it in your calendar and you will remember." But ADHD working memory is limited.
        We forget to check the calendar. We forget we made the list. Out of sight, out of mind
        is not laziness - it is neurology.
      </p>

      <h3 className="text-xl font-semibold text-silver">Assumption 3: Time Feels Linear</h3>
      <p>
        "Schedule 2 hours for this project." But for ADHD brains, time is either "now" or "not now."
        We cannot feel the passage of time the way neurotypical people can. Deadlines in the future
        do not feel real until they are immediate.
      </p>

      <h2 className="text-2xl font-bold text-white">What Actually Works</h2>

      <h3 className="text-xl font-semibold text-silver">Work with Interest, Not Against It</h3>
      <p>
        Instead of forcing yourself to do boring tasks, find ways to make them interesting.
        Add novelty, challenge, or urgency. Pair unpleasant tasks with pleasant environments.
        Use your hyperfocus periods for meaningful work.
      </p>

      <h3 className="text-xl font-semibold text-silver">Externalize Everything</h3>
      <p>
        Do not rely on memory. Use visible reminders - whiteboards, sticky notes, phone alerts.
        Better yet, use external accountability - coaches, partners, or AI tools that follow up
        on your commitments.
      </p>

      <h3 className="text-xl font-semibold text-silver">Create Artificial Urgency</h3>
      <p>
        ADHD brains respond to urgency. Create it artificially with deadlines, body doubling,
        or public commitments. The activation energy to start is highest - once you begin,
        momentum often carries you.
      </p>

      <h3 className="text-xl font-semibold text-silver">Embrace Imperfection</h3>
      <p>
        Perfectionism is procrastination in disguise. Done is better than perfect.
        Start messy, iterate later. The best productivity system is the one you actually use,
        not the theoretically optimal one.
      </p>

      <h2 className="text-2xl font-bold text-white">The Real Secret</h2>
      <p>
        Stop trying to fix yourself. ADHD is not a character flaw to overcome.
        Build systems that work with your brain, not against it. The entrepreneurs who succeed
        with ADHD are not the ones who conquered their symptoms - they are the ones who
        designed their lives around them.
      </p>
    </div>
  )
}

function ADHDAccountability() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        You know what you should do. You even want to do it. But without someone watching,
        it does not happen. This is not weakness - it is how ADHD brains are wired.
      </p>

      <h2 className="text-2xl font-bold text-white">Why External Accountability Works</h2>
      <p>
        ADHD brains struggle with self-directed motivation. But put another person in the equation
        and everything changes. Research shows accountability partners can increase follow-through
        by over 70% for people with ADHD.
      </p>
      <p>
        This is because external accountability creates what ADHD brains need most:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Immediate consequences</strong> - Someone is waiting, so "now" matters</li>
        <li><strong className="text-silver">Social pressure</strong> - We do not want to let others down</li>
        <li><strong className="text-silver">External structure</strong> - The framework comes from outside, not from our executive function</li>
        <li><strong className="text-silver">Dopamine boost</strong> - Social connection provides the stimulation we need</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Types of External Accountability</h2>

      <h3 className="text-xl font-semibold text-silver">Body Doubling</h3>
      <p>
        Working alongside someone else - even silently - dramatically improves focus and productivity.
        Virtual body doubling through apps like Focusmate brings this benefit online.
        Just knowing someone is there changes everything.
      </p>

      <h3 className="text-xl font-semibold text-silver">Accountability Partners</h3>
      <p>
        A peer who checks in regularly on your commitments. This works best when it is mutual -
        you hold each other accountable. Weekly check-ins with clear, specific goals work well.
      </p>

      <h3 className="text-xl font-semibold text-silver">Coaches</h3>
      <p>
        Professional accountability with expertise. ADHD coaches understand the neurology and
        can help you build systems, not just check boxes. The investment creates additional
        motivation to show up prepared.
      </p>

      <h3 className="text-xl font-semibold text-silver">AI Accountability</h3>
      <p>
        AI coaching tools can provide 24/7 accountability without the scheduling constraints
        of human coaches. They remember your commitments, follow up, and extract action items
        from conversations automatically.
      </p>

      <h2 className="text-2xl font-bold text-white">Making Accountability Work</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Be specific</strong> - "I will email John by Friday 5pm" not "I will work on emails"</li>
        <li><strong className="text-silver">Check in frequently</strong> - Weekly is often not enough for ADHD brains</li>
        <li><strong className="text-silver">Choose the right person</strong> - Someone who understands ADHD, not someone who will judge</li>
        <li><strong className="text-silver">Build it into your system</strong> - Accountability should be automatic, not another thing to remember</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Bottom Line</h2>
      <p>
        Needing external accountability is not a failure of willpower. It is smart system design
        for how your brain works. The most successful ADHD entrepreneurs surround themselves with
        people and tools that keep them on track.
      </p>
    </div>
  )
}

function ADHDTimeBlindness() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        "Just be on time." "Plan ahead." "Give yourself buffer." If it were that simple,
        you would have figured it out by now. Time blindness is one of the most misunderstood
        aspects of ADHD.
      </p>

      <h2 className="text-2xl font-bold text-white">What Time Blindness Actually Is</h2>
      <p>
        For ADHD brains, time does not feel like a continuous flow. It exists in two states:
        "now" and "not now." A deadline three weeks away feels the same as one three months away -
        both are "not now" until suddenly they are immediate.
      </p>
      <p>
        This is not poor planning or laziness. Brain imaging studies show that ADHD affects
        the regions responsible for time perception and future planning. You literally
        experience time differently.
      </p>

      <h2 className="text-2xl font-bold text-white">How It Shows Up in Business</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Chronic lateness</strong> - Underestimating how long tasks and travel take</li>
        <li><strong className="text-silver">Missed deadlines</strong> - Projects that seemed far away are suddenly due</li>
        <li><strong className="text-silver">Poor estimation</strong> - Promising delivery times you cannot meet</li>
        <li><strong className="text-silver">Hyperfocus traps</strong> - Losing hours to a task without realizing</li>
        <li><strong className="text-silver">Planning paralysis</strong> - Unable to break long-term goals into actionable steps</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Strategies That Help</h2>

      <h3 className="text-xl font-semibold text-silver">Make Time Visible</h3>
      <p>
        Use visual timers, countdown clocks, and time-tracking apps. When you can see time
        passing, it becomes more real. Put clocks everywhere - especially where you lose track of time.
      </p>

      <h3 className="text-xl font-semibold text-silver">Build in Buffers</h3>
      <p>
        Whatever you think something will take, add 50%. Build transition time between meetings.
        Set fake deadlines before real ones. Your brain will treat the fake deadline as real.
      </p>

      <h3 className="text-xl font-semibold text-silver">Use External Anchors</h3>
      <p>
        Appointments, meetings, and commitments to others create "now" moments in your day.
        Schedule important tasks right before external commitments - the urgency of the
        appointment creates activation energy.
      </p>

      <h3 className="text-xl font-semibold text-silver">Work Backwards from Deadlines</h3>
      <p>
        When you have a project, work backwards from the deadline and schedule specific
        milestones with their own deadlines. Make each milestone feel like its own "now" moment.
      </p>

      <h3 className="text-xl font-semibold text-silver">Automate Reminders</h3>
      <p>
        Do not rely on memory to remind you about time. Set multiple alarms, use calendar
        notifications, and consider tools that follow up on your commitments automatically.
      </p>

      <h2 className="text-2xl font-bold text-white">Acceptance and Adaptation</h2>
      <p>
        Time blindness is not going away. The goal is not to "fix" it but to build systems
        that compensate for it. The most successful ADHD entrepreneurs accept this reality
        and design their businesses around it.
      </p>
    </div>
  )
}

function ADHDOverwhelmSpiral() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Everything feels urgent. You cannot decide where to start. So you start nothing.
        The list grows. The anxiety builds. Welcome to the ADHD overwhelm spiral.
      </p>

      <h2 className="text-2xl font-bold text-white">Understanding the Spiral</h2>
      <p>
        The overwhelm spiral follows a predictable pattern:
      </p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Too many tasks compete for attention</li>
        <li>ADHD brain cannot prioritize - everything feels equally important</li>
        <li>Analysis paralysis sets in - you cannot decide what to do first</li>
        <li>Avoidance begins - you do something easier (or nothing)</li>
        <li>Tasks pile up, making the overwhelm worse</li>
        <li>Shame and self-criticism add emotional weight</li>
        <li>The cycle repeats, intensifying</li>
      </ol>

      <h2 className="text-2xl font-bold text-white">Breaking the Spiral</h2>

      <h3 className="text-xl font-semibold text-silver">Step 1: Stop and Breathe</h3>
      <p>
        When you notice the spiral starting, pause. The urge is to keep spinning, but that
        makes it worse. Five deep breaths. Step away from your computer. Get a glass of water.
        Break the momentum.
      </p>

      <h3 className="text-xl font-semibold text-silver">Step 2: Brain Dump</h3>
      <p>
        Get everything out of your head onto paper or screen. Every task, worry, and thought.
        Do not organize yet - just capture. The goal is to externalize the chaos so your
        brain can stop trying to hold it all.
      </p>

      <h3 className="text-xl font-semibold text-silver">Step 3: Choose ONE Thing</h3>
      <p>
        From your brain dump, pick one task - not the most important, just one you can
        start right now. The bar is low deliberately. Progress on anything breaks the paralysis.
      </p>

      <h3 className="text-xl font-semibold text-silver">Step 4: Make It Tiny</h3>
      <p>
        Whatever task you chose, make it smaller. "Write report" becomes "open document."
        "Email client" becomes "write first sentence." Tiny tasks have tiny activation energy.
      </p>

      <h3 className="text-xl font-semibold text-silver">Step 5: Set a Timer</h3>
      <p>
        Work on your tiny task for just 10 minutes. Knowing there is an end makes starting easier.
        Often, once you start, you will keep going. But if not, 10 minutes is still progress.
      </p>

      <h2 className="text-2xl font-bold text-white">Preventing Future Spirals</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Keep lists short</strong> - A daily list of 3 items, not 30</li>
        <li><strong className="text-silver">Regular brain dumps</strong> - Do not let things pile up in your head</li>
        <li><strong className="text-silver">External support</strong> - Coaches or accountability partners who help you prioritize</li>
        <li><strong className="text-silver">Recognize early signs</strong> - Learn your personal overwhelm triggers</li>
        <li><strong className="text-silver">Self-compassion</strong> - Shame makes everything worse</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">When It Is Really Bad</h2>
      <p>
        Sometimes the spiral goes too deep to break alone. That is when external support matters most.
        A coach, therapist, or even AI assistant can help you sort through the chaos and find
        one small step forward. Asking for help is not weakness - it is strategy.
      </p>
    </div>
  )
}

function AIvsHumanCoaching() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        AI coaching has matured dramatically. But can it really replace the human connection
        of a skilled coach? The honest answer: sometimes yes, sometimes no.
      </p>

      <h2 className="text-2xl font-bold text-white">Where AI Coaching Excels</h2>

      <h3 className="text-xl font-semibold text-silver">Availability</h3>
      <p>
        AI coaches are available 24/7. When anxiety hits at 3am or you need to think through
        a decision before a meeting in 30 minutes, an AI coach is there. No scheduling,
        no waiting weeks for an appointment.
      </p>

      <h3 className="text-xl font-semibold text-silver">Cost</h3>
      <p>
        Human executive coaching costs £300-500 per session. AI coaching costs a fraction of that.
        This makes coaching accessible to founders and managers who could never justify
        the expense of traditional coaching.
      </p>

      <h3 className="text-xl font-semibold text-silver">Memory and Consistency</h3>
      <p>
        Good AI coaches remember every conversation, goal, and commitment you have made.
        They can reference discussions from months ago. Human coaches, no matter how skilled,
        cannot retain this level of detail across clients.
      </p>

      <h3 className="text-xl font-semibold text-silver">Zero Judgment</h3>
      <p>
        Some things are easier to say to an AI than to a human. There is no worry about
        what they think of you, no social dynamics to manage. For sensitive topics,
        this psychological safety can be valuable.
      </p>

      <h2 className="text-2xl font-bold text-white">Where Human Coaches Excel</h2>

      <h3 className="text-xl font-semibold text-silver">Nuance and Intuition</h3>
      <p>
        Skilled human coaches pick up on subtle cues - tone of voice, body language,
        what is not being said. They can sense when to push and when to support in ways
        AI cannot yet match.
      </p>

      <h3 className="text-xl font-semibold text-silver">Deep Expertise</h3>
      <p>
        A human coach who has been a CEO, built companies, or navigated specific challenges
        brings lived experience that AI cannot replicate. Their pattern recognition comes
        from decades of real-world exposure.
      </p>

      <h3 className="text-xl font-semibold text-silver">Human Connection</h3>
      <p>
        Sometimes you need to be seen and heard by another human being. The feeling of
        being truly understood by someone who cares about your success cannot be fully
        replicated by technology.
      </p>

      <h3 className="text-xl font-semibold text-silver">Accountability Weight</h3>
      <p>
        Telling a human coach you did not follow through feels different than telling an AI.
        The social contract creates additional motivation for some people.
      </p>

      <h2 className="text-2xl font-bold text-white">The Hybrid Approach</h2>
      <p>
        Many leaders are finding the best results with both: monthly sessions with a human
        coach for deep strategic work, and AI coaching for daily support, quick decisions,
        and accountability between sessions. The two approaches complement each other.
      </p>

      <h2 className="text-2xl font-bold text-white">Making the Choice</h2>
      <p>
        Consider AI coaching if you need affordable, always-available support, especially
        for ADHD-related challenges. Consider human coaching if you need deep expertise
        in a specific area or value the human connection above all. Consider both if
        you want comprehensive support.
      </p>
    </div>
  )
}

function CoachingVsTherapy() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        "Should I get a coach or a therapist?" It is a common question, and the answer
        matters. They serve different purposes, and choosing wrong can waste time and money.
      </p>

      <h2 className="text-2xl font-bold text-white">The Fundamental Difference</h2>
      <p>
        <strong className="text-silver">Therapy</strong> is about healing. It addresses
        mental health conditions, processes past trauma, and helps you understand why
        you feel and behave the way you do.
      </p>
      <p>
        <strong className="text-silver">Coaching</strong> is about performance. It helps
        you set and achieve goals, develop skills, make decisions, and move forward.
        It assumes you are fundamentally healthy and functional.
      </p>

      <h2 className="text-2xl font-bold text-white">Choose Therapy When...</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>You are experiencing depression, anxiety, or other mental health symptoms</li>
        <li>Past trauma is affecting your present functioning</li>
        <li>You are dealing with addiction or substance use</li>
        <li>Relationships are consistently problematic</li>
        <li>You need to understand the root causes of your patterns</li>
        <li>You are in crisis or having thoughts of self-harm</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Choose Coaching When...</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>You have specific professional or personal goals to achieve</li>
        <li>You want to improve performance in a particular area</li>
        <li>You need help with decision-making and strategic thinking</li>
        <li>You are seeking accountability and structure</li>
        <li>You want to develop new skills or capabilities</li>
        <li>You are fundamentally functioning well but want to do better</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Grey Areas</h2>
      <p>
        Some situations could benefit from either or both:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Burnout</strong> - Coaching for prevention and management, therapy if it has become depression</li>
        <li><strong className="text-silver">Career transitions</strong> - Coaching for strategy, therapy if identity issues arise</li>
        <li><strong className="text-silver">Leadership challenges</strong> - Coaching for skills, therapy if personal issues interfere</li>
        <li><strong className="text-silver">ADHD management</strong> - Both can help - therapy for understanding, coaching for systems</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Credentials Difference</h2>
      <p>
        Therapists are licensed healthcare professionals with graduate degrees and
        thousands of hours of supervised clinical training. They can diagnose and treat
        mental health conditions.
      </p>
      <p>
        Coaches have varied backgrounds. Some have extensive training and certification,
        others have none. There is no legal requirement to call yourself a coach.
        Check credentials carefully.
      </p>

      <h2 className="text-2xl font-bold text-white">Can You Do Both?</h2>
      <p>
        Absolutely. Many people work with both a therapist and a coach simultaneously.
        Therapy addresses underlying issues while coaching drives forward progress.
        Just be clear about what each relationship is for.
      </p>
    </div>
  )
}

function CoachingFrameworks() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Frameworks are the secret weapon of executive coaches. They provide structure
        for messy problems and repeatable processes for thinking clearly. Here are five
        every entrepreneur should know.
      </p>

      <h2 className="text-2xl font-bold text-white">1. GROW Model</h2>
      <p>The most widely used coaching framework in the world.</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">G - Goal</strong>: What do you want to achieve?</li>
        <li><strong className="text-silver">R - Reality</strong>: What is happening now?</li>
        <li><strong className="text-silver">O - Options</strong>: What could you do?</li>
        <li><strong className="text-silver">W - Will</strong>: What will you do?</li>
      </ul>
      <p>
        Best for: Goal setting, problem solving, performance improvement.
      </p>

      <h2 className="text-2xl font-bold text-white">2. Eisenhower Matrix</h2>
      <p>Sort tasks by urgency and importance into four quadrants:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Urgent + Important</strong>: Do immediately</li>
        <li><strong className="text-silver">Not Urgent + Important</strong>: Schedule time for these</li>
        <li><strong className="text-silver">Urgent + Not Important</strong>: Delegate if possible</li>
        <li><strong className="text-silver">Not Urgent + Not Important</strong>: Eliminate</li>
      </ul>
      <p>
        Best for: Prioritization, time management, reducing overwhelm.
      </p>

      <h2 className="text-2xl font-bold text-white">3. SWOT Analysis</h2>
      <p>Assess a situation or decision by examining:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Strengths</strong>: Internal advantages</li>
        <li><strong className="text-silver">Weaknesses</strong>: Internal limitations</li>
        <li><strong className="text-silver">Opportunities</strong>: External possibilities</li>
        <li><strong className="text-silver">Threats</strong>: External risks</li>
      </ul>
      <p>
        Best for: Strategic planning, decision making, competitive analysis.
      </p>

      <h2 className="text-2xl font-bold text-white">4. OKRs (Objectives and Key Results)</h2>
      <p>A goal-setting framework popularized by Google:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Objective</strong>: What you want to achieve (qualitative, inspiring)</li>
        <li><strong className="text-silver">Key Results</strong>: How you will measure success (quantitative, specific)</li>
      </ul>
      <p>
        Typically set quarterly with 3-5 objectives and 3-4 key results each.
        Best for: Aligning team efforts, tracking progress, ambitious goal setting.
      </p>

      <h2 className="text-2xl font-bold text-white">5. Force Field Analysis</h2>
      <p>Understand the forces affecting a change or decision:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Driving Forces</strong>: What pushes toward the goal</li>
        <li><strong className="text-silver">Restraining Forces</strong>: What holds you back</li>
      </ul>
      <p>
        Success comes from strengthening driving forces and weakening restraining ones.
        Best for: Change management, overcoming obstacles, understanding resistance.
      </p>

      <h2 className="text-2xl font-bold text-white">Choosing the Right Framework</h2>
      <p>
        No single framework fits every situation. GROW works for most coaching conversations.
        Eisenhower helps with overwhelm. SWOT suits strategic decisions. OKRs align teams.
        Force Field Analysis unpacks resistance.
      </p>
      <p>
        The best framework is the one you will actually use. Start with one, master it,
        then add others to your toolkit.
      </p>
    </div>
  )
}

function DecisionMakingFounders() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Founders make hundreds of decisions daily. Most do not matter much.
        Some matter enormously. Learning to tell the difference - and decide well on both -
        is a core founder skill.
      </p>

      <h2 className="text-2xl font-bold text-white">The Two Types of Decisions</h2>
      <p>
        Amazon CEO Jeff Bezos distinguishes between:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Type 1 (One-way doors)</strong>: Irreversible or very hard to reverse. These need careful analysis.</li>
        <li><strong className="text-silver">Type 2 (Two-way doors)</strong>: Reversible. Make these quickly and iterate.</li>
      </ul>
      <p>
        Most founders treat too many decisions as Type 1. This slows everything down.
        Default to Type 2 thinking unless proven otherwise.
      </p>

      <h2 className="text-2xl font-bold text-white">Decision-Making Frameworks</h2>

      <h3 className="text-xl font-semibold text-silver">The 10-10-10 Rule</h3>
      <p>
        How will you feel about this decision in 10 minutes? 10 months? 10 years?
        This helps escape short-term emotional reactions and consider long-term impact.
      </p>

      <h3 className="text-xl font-semibold text-silver">Regret Minimization</h3>
      <p>
        Project yourself to age 80. Looking back, which choice would you regret not taking?
        Jeff Bezos used this to decide to start Amazon.
      </p>

      <h3 className="text-xl font-semibold text-silver">Pre-Mortem</h3>
      <p>
        Imagine the decision failed spectacularly. What went wrong?
        This surfaces risks your optimistic brain might overlook.
      </p>

      <h3 className="text-xl font-semibold text-silver">Decision Journal</h3>
      <p>
        Write down the decision, your reasoning, and expected outcomes.
        Review later to improve your decision-making process over time.
      </p>

      <h2 className="text-2xl font-bold text-white">Common Decision Traps</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Analysis paralysis</strong>: Gathering more data when you have enough</li>
        <li><strong className="text-silver">Confirmation bias</strong>: Seeking information that supports what you already believe</li>
        <li><strong className="text-silver">Sunk cost fallacy</strong>: Continuing because of past investment, not future value</li>
        <li><strong className="text-silver">Decision fatigue</strong>: Making worse decisions as the day progresses</li>
        <li><strong className="text-silver">Consensus seeking</strong>: Prioritizing agreement over the right answer</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Practical Tips</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-silver">Set deadlines</strong>: Decide by X date, even if imperfect</li>
        <li><strong className="text-silver">Make important decisions early</strong>: When cognitive resources are fresh</li>
        <li><strong className="text-silver">Sleep on big decisions</strong>: But only once - do not use this to procrastinate</li>
        <li><strong className="text-silver">Talk it through</strong>: Explaining to someone else often clarifies your own thinking</li>
        <li><strong className="text-silver">Delegate more</strong>: Not every decision needs to be yours</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">When You Are Stuck</h2>
      <p>
        If you cannot decide, ask yourself: What would I tell a friend in this situation?
        We often know the answer but resist it. External perspective - from a coach,
        advisor, or even AI - can help you access what you already know.
      </p>
    </div>
  )
}
