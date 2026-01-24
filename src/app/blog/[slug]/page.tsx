import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ArticleLayout } from '@/components/blog/ArticleLayout'
import { getArticleBySlug, articles, getArticleContent } from '@/lib/content/articles'
import { FAQSchema } from '@/components/FAQSchema'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

  // Try to get markdown content from file
  const markdownContent = getArticleContent(slug)

  // Check if this is one of the original inline articles
  const inlineContent = inlineContentMap[slug]

  return (
    <>
      {article.faqs && article.faqs.length > 0 && <FAQSchema faqs={article.faqs} />}
      <ArticleLayout article={article}>
        {markdownContent ? (
          <MarkdownContent content={markdownContent} />
        ) : inlineContent ? (
          inlineContent
        ) : (
          <PlaceholderContent />
        )}
      </ArticleLayout>
    </>
  )
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-silver-light prose-strong:text-white prose-a:text-deep-blue-400 prose-a:no-underline hover:prose-a:text-deep-blue-300 prose-ul:text-silver-light prose-ol:text-silver-light prose-li:marker:text-deep-blue-400 prose-table:border-collapse prose-th:border prose-th:border-titanium-700 prose-th:bg-titanium-800 prose-th:p-3 prose-th:text-white prose-td:border prose-td:border-titanium-700 prose-td:p-3 prose-td:text-silver-light prose-hr:border-titanium-700">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

function PlaceholderContent() {
  return (
    <div className="text-silver-light">
      <p>Content coming soon.</p>
    </div>
  )
}

// Original inline content for the first 14 articles
const inlineContentMap: Record<string, React.ReactNode> = {
  'adhd-entrepreneur-guide': <ADHDEntrepreneurGuide />,
  'why-productivity-advice-fails-adhd': <WhyProductivityFailsADHD />,
  'adhd-accountability': <ADHDAccountability />,
  'adhd-time-blindness-business': <ADHDTimeBlindness />,
  'adhd-task-management-systems': <ADHDTaskManagementGuide />,
  'adhd-decision-fatigue': <ADHDDecisionFatigueGuide />,
  'adhd-overwhelm-spiral': <ADHDOverwhelmSpiral />,
  'executive-coaching-cost-2025': <ExecutiveCoachingCostGuide />,
  'ai-coaching-vs-human-coaching': <AIvsHumanCoaching />,
  'coaching-vs-therapy': <CoachingVsTherapy />,
  'grow-coaching-model-adhd': <GROWModelGuide />,
  'coaching-frameworks-entrepreneurs': <CoachingFrameworks />,
  'founder-loneliness': <FounderLonelinessGuide />,
  'decision-making-founders': <DecisionMakingFounders />,
}

// Original inline content components
function ADHDEntrepreneurGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        If you have ADHD, you are <strong className="text-white">300% more likely to start your own business</strong>.
        That is not a typo. The same traits that make traditional employment challenging can make you an exceptional entrepreneur.
      </p>

      <h2 className="text-2xl font-bold text-white">Why ADHD Brains Excel at Entrepreneurship</h2>
      <p>
        Research consistently shows that ADHD entrepreneurs bring unique strengths to business. The ability to hyperfocus,
        think creatively, take calculated risks, and pivot quickly are all ADHD traits that translate directly to entrepreneurial success.
      </p>

      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Famous ADHD Entrepreneurs</h3>
        <ul className="space-y-2">
          <li><strong className="text-white">Richard Branson</strong> - Virgin Group</li>
          <li><strong className="text-white">David Neeleman</strong> - JetBlue Airways</li>
          <li><strong className="text-white">Barbara Corcoran</strong> - Shark Tank investor</li>
          <li><strong className="text-white">Paul Orfalea</strong> - Kinko&apos;s founder</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white">The Challenges Are Real</h2>
      <p>
        But let&apos;s be honest: running a business with ADHD also comes with significant challenges. Time blindness,
        difficulty with routine tasks, emotional dysregulation, and struggles with follow-through can all impact your business.
      </p>

      <p>
        The key is not to &quot;fix&quot; your ADHD, but to build systems that work <em>with</em> your brain rather than against it.
      </p>

      <h2 className="text-2xl font-bold text-white">Building ADHD-Friendly Business Systems</h2>

      <h3 className="text-xl font-semibold text-white">1. External Accountability</h3>
      <p>
        ADHD brains thrive on external accountability. This might mean a business partner, a coach, regular mastermind meetings,
        or even an AI coach that helps you stay on track. The key is having someone or something outside yourself to report to.
      </p>

      <h3 className="text-xl font-semibold text-white">2. Capture Systems</h3>
      <p>
        Your brilliant ideas will disappear if you do not capture them immediately. Build a simple, always-accessible system
        for capturing thoughts, ideas, and tasks. Voice notes work well for many ADHD entrepreneurs.
      </p>

      <h3 className="text-xl font-semibold text-white">3. Task Extraction</h3>
      <p>
        Turn conversations and ideas into concrete action items. This is where tools like Coach OS can help - automatically
        extracting tasks from coaching sessions so nothing falls through the cracks.
      </p>

      <h3 className="text-xl font-semibold text-white">4. Environment Design</h3>
      <p>
        Your environment shapes your behavior more than willpower ever will. Design your workspace, tools, and routines
        to make the right actions easy and distractions hard to access.
      </p>

      <h2 className="text-2xl font-bold text-white">The Role of Coaching</h2>
      <p>
        Many ADHD entrepreneurs find coaching invaluable. A coach provides the external structure, accountability, and
        thinking partner that ADHD brains often need. Traditional executive coaching can be expensive at £300-500 per session,
        but AI coaching offers an accessible alternative that&apos;s available 24/7.
      </p>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Coach OS is Built for ADHD Entrepreneurs</h3>
        <p>
          Our AI coaching platform uses proven frameworks like GROW and provides the external accountability
          ADHD brains need. Voice coaching, automatic task extraction, and 24/7 availability mean support is there
          when you need it.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">Next Steps</h2>
      <p>
        If you&apos;re an ADHD entrepreneur looking to build better systems, start with these questions:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>What external accountability do I currently have?</li>
        <li>How am I capturing ideas and tasks right now?</li>
        <li>What environment changes would support better focus?</li>
        <li>Where do I need thinking partner support?</li>
      </ul>

      <p>
        Your ADHD is not a limitation on your entrepreneurial success - with the right systems, it can be your greatest advantage.
      </p>
    </div>
  )
}

function WhyProductivityFailsADHD() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        You have tried Pomodoro. You have tried time blocking. You have tried GTD, bullet journaling, and every productivity
        app on the market. And they all fail you eventually. <strong className="text-white">It is not your fault.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">The Problem with Traditional Productivity</h2>
      <p>
        Most productivity systems were designed by neurotypical people for neurotypical brains. They assume you can:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Estimate how long tasks will take (time blindness says no)</li>
        <li>Start tasks when scheduled (initiation difficulties say no)</li>
        <li>Maintain consistent routines (novelty-seeking says no)</li>
        <li>Feel motivated by distant rewards (dopamine differences say no)</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Why Specific Methods Fail</h2>

      <h3 className="text-xl font-semibold text-white">The Pomodoro Technique</h3>
      <p>
        25 minutes on, 5 minutes off sounds great in theory. But ADHD brains do not work in predictable intervals.
        When you are in hyperfocus, a timer interrupts your flow. When you are struggling, 25 minutes feels like torture.
        The rigid structure fights against your brain&apos;s natural rhythms.
      </p>

      <h3 className="text-xl font-semibold text-white">Time Blocking</h3>
      <p>
        Scheduling your entire day in advance assumes you can predict your energy, focus, and interruptions.
        For ADHD brains, this creates a setup for failure. One derailed block cascades into a day of missed commitments
        and shame spirals.
      </p>

      <h3 className="text-xl font-semibold text-white">Getting Things Done (GTD)</h3>
      <p>
        GTD requires extensive capture, processing, and review systems. For ADHD brains, the overhead of maintaining
        the system often exceeds the benefit. Plus, the weekly review becomes another task you feel guilty about skipping.
      </p>

      <h2 className="text-2xl font-bold text-white">What Actually Works</h2>

      <h3 className="text-xl font-semibold text-white">1. External Accountability</h3>
      <p>
        Instead of relying on internal motivation, create external structures. Body doubling, accountability partners,
        and coaches provide the external pressure ADHD brains often need to initiate and complete tasks.
      </p>

      <h3 className="text-xl font-semibold text-white">2. Flexible Systems</h3>
      <p>
        Build systems that adapt to your energy and focus levels. On high-energy days, tackle challenging work.
        On low-energy days, have a list of &quot;low-stakes&quot; tasks ready. The system serves you, not the other way around.
      </p>

      <h3 className="text-xl font-semibold text-white">3. Immediate Rewards</h3>
      <p>
        ADHD brains are motivated by immediate rewards, not distant goals. Build small rewards into your work process.
        Gamification, frequent breaks, and celebrating small wins can all help.
      </p>

      <h3 className="text-xl font-semibold text-white">4. Reduce Friction</h3>
      <p>
        The harder something is to start, the less likely you are to do it. Remove every possible barrier between you
        and the task. Prepare the night before. Keep tools accessible. Simplify your processes.
      </p>

      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">The Coach OS Approach</h3>
        <p>
          Coach OS adapts to how ADHD brains actually work. Voice coaching meets you where you are.
          Automatic task extraction removes the burden of capturing action items. Available 24/7, so support is there
          when motivation strikes - even at midnight.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">The Bottom Line</h2>
      <p>
        Stop trying to force yourself into systems designed for different brains. Instead, build systems that leverage
        your strengths and accommodate your challenges. Your productivity system should feel sustainable, not like
        a constant battle against yourself.
      </p>
    </div>
  )
}

function ADHDAccountability() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        If you have ADHD, you have probably noticed something: you can move mountains when someone else is counting on you,
        but struggle to complete basic tasks for yourself. <strong className="text-white">This is not a character flaw - it is how your brain works.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">The Science of External Accountability</h2>
      <p>
        ADHD brains have differences in dopamine regulation that affect motivation and reward processing.
        Internal motivation (&quot;I should do this&quot;) often is not enough to trigger action. External accountability
        (&quot;Someone is expecting this from me&quot;) provides the external pressure that helps bridge the gap between intention and action.
      </p>

      <h2 className="text-2xl font-bold text-white">Types of External Accountability</h2>

      <h3 className="text-xl font-semibold text-white">Body Doubling</h3>
      <p>
        Working alongside someone else - even if they are doing completely different work - can dramatically improve focus and productivity.
        The presence of another person provides gentle accountability and reduces the sense of isolation that can trigger avoidance.
      </p>

      <h3 className="text-xl font-semibold text-white">Accountability Partners</h3>
      <p>
        Regular check-ins with someone who asks &quot;Did you do what you said you would?&quot; creates external deadlines
        and social pressure that can help ADHD brains follow through on commitments.
      </p>

      <h3 className="text-xl font-semibold text-white">Coaching</h3>
      <p>
        A coach provides structured accountability plus the thinking partner support that helps ADHD brains process
        decisions and plan actions. The combination of accountability and guidance can be transformative.
      </p>

      <h3 className="text-xl font-semibold text-white">AI Coaching</h3>
      <p>
        AI coaches like Coach OS provide always-available accountability without the scheduling constraints of human
        coaches. When motivation strikes at 10pm or you need to process a decision at 6am, support is there.
      </p>

      <h2 className="text-2xl font-bold text-white">Building Your Accountability System</h2>
      <ol className="list-decimal space-y-4 pl-6">
        <li>
          <strong className="text-white">Identify your accountability gaps.</strong> Where do you consistently struggle to follow through?
        </li>
        <li>
          <strong className="text-white">Match the accountability type to the need.</strong> Body doubling for focus, partners for deadlines, coaching for decisions.
        </li>
        <li>
          <strong className="text-white">Start small.</strong> One accountability mechanism is better than an elaborate system you will not maintain.
        </li>
        <li>
          <strong className="text-white">Adjust based on results.</strong> If something is not working, try a different approach.
        </li>
      </ol>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Coach OS Accountability Features</h3>
        <ul className="space-y-2">
          <li><strong className="text-white">24/7 availability</strong> - Accountability when you need it</li>
          <li><strong className="text-white">Task tracking</strong> - Visual progress on your commitments</li>
          <li><strong className="text-white">Regular check-ins</strong> - Framework-based sessions that keep you on track</li>
          <li><strong className="text-white">Voice support</strong> - Talk through challenges and decisions anytime</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white">The Key Insight</h2>
      <p>
        Needing external accountability is not a weakness to overcome. It is a feature of your brain to work with.
        The most successful ADHD entrepreneurs build robust external accountability systems rather than trying to
        generate motivation from within.
      </p>
    </div>
  )
}

function ADHDTimeBlindness() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        For most people, time flows in a predictable stream. For ADHD brains, time exists in two states:
        <strong className="text-white">&quot;now&quot; and &quot;not now.&quot;</strong> This phenomenon, called time blindness,
        is one of the most challenging aspects of running a business with ADHD.
      </p>

      <h2 className="text-2xl font-bold text-white">What Is Time Blindness?</h2>
      <p>
        Time blindness is the difficulty perceiving and estimating the passage of time. It manifests as:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Underestimating how long tasks will take</li>
        <li>Losing track of time while working (or procrastinating)</li>
        <li>Difficulty planning for future events that feel &quot;far away&quot;</li>
        <li>Chronically running late despite best intentions</li>
        <li>Struggling to break down projects into realistic timelines</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Business Impact</h2>
      <p>
        In business, time blindness can lead to:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Missed deadlines and damaged client relationships</li>
        <li>Underpriced projects (because you underestimate the time required)</li>
        <li>Overwhelming workloads from over-committing</li>
        <li>Chronic stress and last-minute scrambles</li>
        <li>Difficulty with long-term strategic planning</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Strategies That Help</h2>

      <h3 className="text-xl font-semibold text-white">1. Make Time Visible</h3>
      <p>
        Use visual timers, analog clocks, and calendar blocking to make the passage of time tangible.
        Digital timers with visual countdowns can help you &quot;see&quot; time passing.
      </p>

      <h3 className="text-xl font-semibold text-white">2. Time Boxing with Buffer</h3>
      <p>
        When estimating how long something will take, double or triple your initial estimate.
        Build buffer time into every schedule. It is better to finish early than to constantly run behind.
      </p>

      <h3 className="text-xl font-semibold text-white">3. External Time Keepers</h3>
      <p>
        Use alarms, reminders, and people to alert you when it is time to transition.
        Do not rely on your internal sense of time - it will mislead you.
      </p>

      <h3 className="text-xl font-semibold text-white">4. Reverse Engineering Deadlines</h3>
      <p>
        Start from the deadline and work backward, scheduling specific tasks with buffer time.
        Make &quot;future&quot; deadlines feel &quot;now&quot; by breaking them into immediate action items.
      </p>

      <h3 className="text-xl font-semibold text-white">5. Same-Day Planning</h3>
      <p>
        Plan your day the morning of, not the night before. ADHD brains respond better to immediate relevance.
        Adjust your plan based on your actual energy and focus that day.
      </p>

      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">How Coach OS Helps</h3>
        <p>
          Coach OS provides the external structure and check-ins that help compensate for time blindness.
          Regular coaching sessions create recurring &quot;now&quot; moments. Task tracking makes progress visible.
          And 24/7 availability means you can process and plan whenever time blindness lets you down.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">The Key Mindset Shift</h2>
      <p>
        Accept that your internal time perception is unreliable. This is not a moral failing - it is a neurological
        difference. Build external systems to compensate, and stop beating yourself up when your time sense fails you.
      </p>
    </div>
  )
}

function ADHDTaskManagementGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        If traditional to-do lists leave you feeling overwhelmed and paralyzed, you are not alone.
        Here are <strong className="text-white">5 task management systems</strong> designed for how ADHD brains actually work.
      </p>

      <h2 className="text-2xl font-bold text-white">1. The Brain Dump + Daily 3</h2>
      <p>
        Instead of maintaining an overwhelming master list, do a complete brain dump whenever you feel cluttered.
        Get everything out of your head onto paper (or a digital tool). Then each morning, choose just THREE tasks
        to focus on that day. This reduces decision fatigue and creates achievable daily goals.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Those who feel paralyzed by long lists</p>
      </div>

      <h2 className="text-2xl font-bold text-white">2. Visual Kanban Boards</h2>
      <p>
        ADHD brains respond well to visual systems. A Kanban board with columns like &quot;To Do,&quot; &quot;Doing,&quot; and &quot;Done&quot;
        makes progress tangible. Moving cards between columns provides small dopamine hits that maintain motivation.
        Tools like Trello or physical sticky notes work well.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Visual thinkers who need to see progress</p>
      </div>

      <h2 className="text-2xl font-bold text-white">3. Time-Based Task Buckets</h2>
      <p>
        Instead of organizing by project or priority, organize by how long tasks take: 5 minutes, 15 minutes, 30 minutes, 1 hour+.
        When you have a pocket of time, grab a task from the matching bucket. This removes the friction of deciding what to do
        and matches tasks to available energy windows.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Those with unpredictable schedules</p>
      </div>

      <h2 className="text-2xl font-bold text-white">4. The Capture and Process System</h2>
      <p>
        Have ONE place to capture everything that comes to mind - ideas, tasks, reminders. Use voice notes if writing
        is a barrier. Once daily (or whenever), process your captures into actionable items or delete them.
        The key is instant capture with delayed processing.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Those who lose ideas and forget tasks</p>
      </div>

      <h2 className="text-2xl font-bold text-white">5. External Task Extraction</h2>
      <p>
        Let someone else extract your tasks. In coaching conversations, your coach identifies action items and tracks them for you.
        This removes the cognitive load of self-monitoring and provides built-in accountability.
        Coach OS does this automatically from voice sessions.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Those who struggle to identify and track their own tasks</p>
      </div>

      <h2 className="text-2xl font-bold text-white">Choosing Your System</h2>
      <p>
        The best system is the one you will actually use. Experiment with each approach for at least a week before deciding.
        And remember: you can combine elements from multiple systems to create something that works for your unique brain.
      </p>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Start Here</h3>
        <p>
          If you are not sure which system to try first, start with the Brain Dump + Daily 3.
          It requires minimal setup and immediately reduces overwhelm. You can always add complexity later.
        </p>
      </div>
    </div>
  )
}

function ADHDDecisionFatigueGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Should you answer that email now or later? What should you work on next? What should you have for lunch?
        For ADHD brains, even <strong className="text-white">small choices can feel impossibly heavy</strong>.
        This is decision fatigue, and it hits ADHD brains harder than neurotypical ones.
      </p>

      <h2 className="text-2xl font-bold text-white">Why ADHD Brains Struggle with Decisions</h2>
      <p>
        ADHD affects the prefrontal cortex - the part of your brain responsible for executive functions like decision-making.
        Combined with difficulties in prioritization and emotional regulation, even simple decisions can become paralyzing.
      </p>

      <h3 className="text-xl font-semibold text-white">The ADHD Decision Spiral</h3>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Face a decision (big or small)</li>
        <li>Struggle to evaluate options due to executive function challenges</li>
        <li>Become overwhelmed by the cognitive load</li>
        <li>Avoid the decision through procrastination or distraction</li>
        <li>Feel guilt and anxiety about the unmade decision</li>
        <li>Have even less cognitive capacity for the next decision</li>
      </ol>

      <h2 className="text-2xl font-bold text-white">Strategies to Reduce Decision Fatigue</h2>

      <h3 className="text-xl font-semibold text-white">1. Reduce the Number of Decisions</h3>
      <p>
        Every decision you can eliminate saves cognitive energy for decisions that matter. Pre-decide as much as possible:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Wear the same type of outfit (Steve Jobs style)</li>
        <li>Eat the same breakfast each day</li>
        <li>Have set routines for repetitive tasks</li>
        <li>Use templates and systems for recurring decisions</li>
      </ul>

      <h3 className="text-xl font-semibold text-white">2. Make Important Decisions Early</h3>
      <p>
        Your decision-making capacity is highest in the morning (for most people).
        Front-load important decisions before the day drains your cognitive resources.
      </p>

      <h3 className="text-xl font-semibold text-white">3. Set Decision Deadlines</h3>
      <p>
        Give yourself a time limit for decisions. &quot;I will decide by 3pm&quot; prevents endless rumination.
        Often a &quot;good enough&quot; decision made quickly beats a &quot;perfect&quot; decision made too late.
      </p>

      <h3 className="text-xl font-semibold text-white">4. Use Decision Frameworks</h3>
      <p>
        Frameworks like GROW give you a structured process for working through decisions.
        Instead of free-floating anxiety, you have concrete steps to follow.
      </p>

      <h3 className="text-xl font-semibold text-white">5. Get External Input</h3>
      <p>
        A coach, mentor, or trusted advisor can help you process decisions without the full cognitive load falling on you.
        Sometimes just talking through options out loud is enough to find clarity.
      </p>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">How Coach OS Helps</h3>
        <p>
          Coach OS provides a thinking partner for decisions whenever you need one.
          Using frameworks like GROW, it guides you through structured decision-making that reduces cognitive overwhelm.
          Available 24/7, so decision support is there when you need it - not just during scheduled sessions.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">The Permission to Decide Imperfectly</h2>
      <p>
        Perfectionism often underlies decision paralysis. Give yourself permission to make &quot;good enough&quot; decisions.
        Most decisions are reversible. Most &quot;wrong&quot; choices teach valuable lessons. The cost of not deciding
        usually exceeds the cost of deciding imperfectly.
      </p>
    </div>
  )
}

function ADHDOverwhelmSpiral() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        You have a to-do list that feels infinite. Everything seems equally urgent. The more you think about what to do,
        the less you actually do. <strong className="text-white">Welcome to the ADHD overwhelm spiral</strong> - and here is how to escape it.
      </p>

      <h2 className="text-2xl font-bold text-white">Understanding the Overwhelm Spiral</h2>
      <p>
        The ADHD overwhelm spiral typically follows this pattern:
      </p>
      <ol className="list-decimal space-y-2 pl-6">
        <li><strong className="text-white">Trigger:</strong> Multiple demands compete for attention</li>
        <li><strong className="text-white">Paralysis:</strong> Unable to prioritize, you freeze</li>
        <li><strong className="text-white">Avoidance:</strong> You distract yourself to escape the discomfort</li>
        <li><strong className="text-white">Accumulation:</strong> Tasks pile up while you avoid</li>
        <li><strong className="text-white">Shame:</strong> Guilt about avoidance adds emotional weight</li>
        <li><strong className="text-white">Deeper paralysis:</strong> The combined load becomes even more overwhelming</li>
      </ol>

      <h2 className="text-2xl font-bold text-white">Breaking the Spiral</h2>

      <h3 className="text-xl font-semibold text-white">Step 1: Acknowledge Without Judgment</h3>
      <p>
        First, recognize that you are in an overwhelm spiral. This is not a character flaw - it is a common ADHD experience.
        Self-criticism only adds to the cognitive load. Notice what is happening with curiosity, not judgment.
      </p>

      <h3 className="text-xl font-semibold text-white">Step 2: Physical Reset</h3>
      <p>
        Overwhelm lives in your nervous system, not just your mind. Before trying to think your way out:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Take 5 deep breaths (exhale longer than inhale)</li>
        <li>Move your body - even a 5-minute walk helps</li>
        <li>Change your physical environment</li>
        <li>Drink water, eat if you have not recently</li>
      </ul>

      <h3 className="text-xl font-semibold text-white">Step 3: Brain Dump Everything</h3>
      <p>
        Get every single task, worry, and &quot;should&quot; out of your head and onto paper.
        Do not organize - just dump. This externalizes the overwhelm and makes it tangible rather than infinite.
      </p>

      <h3 className="text-xl font-semibold text-white">Step 4: Find ONE Thing</h3>
      <p>
        From your brain dump, identify ONE small task you can complete in the next 15 minutes.
        It does not have to be the most important thing. It just needs to be completable.
        Completing anything breaks the paralysis loop.
      </p>

      <h3 className="text-xl font-semibold text-white">Step 5: Build Momentum</h3>
      <p>
        After completing one task, choose another small one. Do not try to tackle the big stuff yet.
        Let small wins accumulate until you feel your capacity returning.
      </p>

      <h2 className="text-2xl font-bold text-white">Preventing Future Spirals</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">Regular brain dumps</strong> - Do not let things accumulate in your head</li>
        <li><strong className="text-white">Daily limits</strong> - Cap your &quot;must do&quot; list at 3 items</li>
        <li><strong className="text-white">External accountability</strong> - Coaches and partners catch spirals early</li>
        <li><strong className="text-white">Scheduled recovery</strong> - Build rest into your routine before you need it</li>
      </ul>

      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">When You are Spiraling Now</h3>
        <p>
          If you are currently in an overwhelm spiral, close this article after reading this:
          Stand up. Take 3 deep breaths. Write down everything in your head on paper.
          Pick ONE tiny thing from the list and do it immediately. Then decide what comes next.
        </p>
      </div>
    </div>
  )
}

function ExecutiveCoachingCostGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Executive coaching can transform careers and businesses. But with rates of
        <strong className="text-white"> £300-500 per session</strong>, it is out of reach for most professionals.
        Let&apos;s break down the real costs and explore alternatives.
      </p>

      <h2 className="text-2xl font-bold text-white">What Executive Coaching Actually Costs</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-titanium-700">
              <th className="px-4 py-3 text-left font-semibold text-white">Coach Level</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Per Session</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Monthly (4 sessions)</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3">Junior/New Coach</td>
              <td className="px-4 py-3">£100-200</td>
              <td className="px-4 py-3">£400-800</td>
              <td className="px-4 py-3">£4,800-9,600</td>
            </tr>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3">Experienced Coach</td>
              <td className="px-4 py-3">£200-350</td>
              <td className="px-4 py-3">£800-1,400</td>
              <td className="px-4 py-3">£9,600-16,800</td>
            </tr>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3">Senior/Executive</td>
              <td className="px-4 py-3">£300-500</td>
              <td className="px-4 py-3">£1,200-2,000</td>
              <td className="px-4 py-3">£14,400-24,000</td>
            </tr>
            <tr>
              <td className="px-4 py-3">C-Suite Specialist</td>
              <td className="px-4 py-3">£500-1,000+</td>
              <td className="px-4 py-3">£2,000-4,000+</td>
              <td className="px-4 py-3">£24,000-48,000+</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white">Where the Money Goes</h2>
      <p>
        Executive coaches justify their rates based on:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Years of training and certifications (ICF, etc.)</li>
        <li>One-on-one personal attention</li>
        <li>Confidentiality and trust relationships</li>
        <li>Preparation time outside sessions</li>
        <li>Results and ROI they deliver</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The ROI Question</h2>
      <p>
        Studies show executive coaching can deliver 5-7x ROI through improved performance, better decisions,
        and avoided mistakes. For C-suite executives making decisions worth millions, £50,000/year for a coach
        might be a bargain. But for individual professionals or small business owners, the math is different.
      </p>

      <h2 className="text-2xl font-bold text-white">Alternatives to Traditional Coaching</h2>

      <h3 className="text-xl font-semibold text-white">Group Coaching</h3>
      <p>
        Share a coach with others in similar situations. Costs: £200-500/month.
        Trade-off: Less personalized attention, but peer learning benefits.
      </p>

      <h3 className="text-xl font-semibold text-white">Peer Coaching Networks</h3>
      <p>
        Form or join a group of peers who coach each other. Cost: Free (time investment).
        Trade-off: Requires finding the right people and maintaining commitment.
      </p>

      <h3 className="text-xl font-semibold text-white">AI Coaching</h3>
      <p>
        Modern AI coaching platforms use proven frameworks and provide always-available support.
        Costs: £10-50/month. Trade-off: No human relationship, but 24/7 availability and consistency.
      </p>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Coach OS: £40/month</h3>
        <p>
          Coach OS provides framework-based coaching (GROW, SWOT, etc.) with voice and chat options.
          24/7 availability means support when you need it. Automatic task extraction ensures action items
          do not get lost. At 1/100th the cost of traditional coaching, it makes professional coaching accessible.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">When You Need Human Coaching</h2>
      <p>
        AI coaching is not a complete replacement for human coaches. Consider human coaching when you need:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Deep emotional processing</li>
        <li>Complex interpersonal navigation</li>
        <li>Industry-specific expertise</li>
        <li>High-stakes situations requiring experienced judgment</li>
        <li>Accountability that only a human relationship provides</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">The Smart Approach</h2>
      <p>
        Many professionals now use a hybrid approach: AI coaching for regular support and thinking partner needs,
        with occasional human coaching sessions for deeper work. This delivers most of the benefit at a fraction of the cost.
      </p>
    </div>
  )
}

function AIvsHumanCoaching() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        AI coaching is getting remarkably good. But can it really replace human coaches?
        <strong className="text-white"> The honest answer: it depends on what you need.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">Where AI Coaching Excels</h2>

      <h3 className="text-xl font-semibold text-white">Availability</h3>
      <p>
        Human coaches have schedules. AI coaches do not. When you need to process a decision at 11pm or
        work through anxiety at 6am, AI is there. This 24/7 availability is transformative for many people.
      </p>

      <h3 className="text-xl font-semibold text-white">Consistency</h3>
      <p>
        AI applies frameworks consistently every time. No off days, no distraction, no forgetting what you discussed
        last session. The methodology is always available and always applied correctly.
      </p>

      <h3 className="text-xl font-semibold text-white">Cost</h3>
      <p>
        At £10-50/month versus £300-500/session, AI coaching is 100x more accessible.
        This democratizes coaching for people who could never afford human coaches.
      </p>

      <h3 className="text-xl font-semibold text-white">No Judgment</h3>
      <p>
        Some people hold back with human coaches due to fear of judgment. AI creates a safe space to explore
        thoughts and challenges without social pressure.
      </p>

      <h2 className="text-2xl font-bold text-white">Where Human Coaches Excel</h2>

      <h3 className="text-xl font-semibold text-white">Deep Emotional Work</h3>
      <p>
        When coaching touches deep emotional territory - childhood patterns, trauma, identity crises -
        human presence and empathy matter. AI can support, but human connection is often essential.
      </p>

      <h3 className="text-xl font-semibold text-white">Complex Interpersonal Dynamics</h3>
      <p>
        Navigating office politics, board relationships, or partner conflicts requires nuanced understanding
        of human behavior that AI is still developing.
      </p>

      <h3 className="text-xl font-semibold text-white">Industry Expertise</h3>
      <p>
        A coach with 20 years in your industry brings pattern recognition and specific knowledge
        that general-purpose AI cannot match.
      </p>

      <h3 className="text-xl font-semibold text-white">Accountability Through Relationship</h3>
      <p>
        Some people need the accountability of a real human relationship. The thought of disappointing
        someone you respect can be more motivating than any AI prompt.
      </p>

      <h2 className="text-2xl font-bold text-white">The Hybrid Approach</h2>
      <p>
        Many people are finding success with a hybrid approach:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">AI coaching</strong> for daily/weekly thinking partner needs</li>
        <li><strong className="text-white">Human coaching</strong> monthly or quarterly for deeper work</li>
        <li><strong className="text-white">Combined cost</strong> often less than human-only coaching</li>
        <li><strong className="text-white">Best of both worlds</strong> - accessibility plus depth</li>
      </ul>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Coach OS Position</h3>
        <p>
          Coach OS is designed as a thinking partner and framework guide, not a replacement for all human coaching.
          Use it for decision support, goal tracking, and regular check-ins. Add human coaching when you need
          deep emotional work or specialized expertise.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">Making Your Choice</h2>
      <p>
        Consider AI coaching if you need:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Regular thinking partner support</li>
        <li>Framework-based decision help</li>
        <li>Goal tracking and accountability</li>
        <li>Accessible, affordable coaching</li>
        <li>24/7 availability</li>
      </ul>
      <p className="mt-4">
        Consider human coaching if you need:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Deep emotional processing</li>
        <li>Industry-specific expertise</li>
        <li>Complex relationship navigation</li>
        <li>High-stakes situations</li>
        <li>Human accountability</li>
      </ul>
    </div>
  )
}

function CoachingVsTherapy() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Both coaching and therapy can help you grow and solve problems.
        <strong className="text-white"> But they serve different purposes and work in different ways.</strong>
        Understanding the difference helps you choose the right support.
      </p>

      <h2 className="text-2xl font-bold text-white">Key Differences</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-titanium-700">
              <th className="px-4 py-3 text-left font-semibold text-white">Aspect</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Coaching</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Therapy</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3 font-semibold text-white">Focus</td>
              <td className="px-4 py-3">Future-oriented, goal-driven</td>
              <td className="px-4 py-3">Past and present, healing-focused</td>
            </tr>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3 font-semibold text-white">Approach</td>
              <td className="px-4 py-3">Action and accountability</td>
              <td className="px-4 py-3">Understanding and processing</td>
            </tr>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3 font-semibold text-white">Starting Point</td>
              <td className="px-4 py-3">Functional, wanting to improve</td>
              <td className="px-4 py-3">May be struggling to function</td>
            </tr>
            <tr className="border-b border-titanium-800">
              <td className="px-4 py-3 font-semibold text-white">Practitioner</td>
              <td className="px-4 py-3">Certified coach (ICF, etc.)</td>
              <td className="px-4 py-3">Licensed therapist/psychologist</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-white">Duration</td>
              <td className="px-4 py-3">Usually time-bound (3-12 months)</td>
              <td className="px-4 py-3">Often ongoing or as-needed</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white">When to Choose Coaching</h2>
      <p>Coaching is appropriate when you:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Have specific goals you want to achieve</li>
        <li>Are generally functioning well but want to improve</li>
        <li>Need accountability and structure</li>
        <li>Want to develop specific skills or behaviors</li>
        <li>Are facing a transition or challenge</li>
        <li>Need a thinking partner for decisions</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">When to Choose Therapy</h2>
      <p>Therapy is appropriate when you:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Are struggling with mental health symptoms</li>
        <li>Have trauma that needs processing</li>
        <li>Experience depression, anxiety, or other diagnoses</li>
        <li>Are having difficulty functioning day-to-day</li>
        <li>Need to work through past experiences</li>
        <li>Want to understand deep patterns in your life</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">When You Might Need Both</h2>
      <p>
        Many people benefit from both coaching and therapy at different times or even simultaneously.
        Therapy addresses the underlying issues while coaching helps you move forward with goals.
        The key is recognizing which support serves which need.
      </p>

      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Important Note</h3>
        <p>
          If you are experiencing thoughts of self-harm, severe depression, or crisis, please seek professional
          mental health support. Coaching is not appropriate for mental health emergencies.
          In the UK, you can contact: Samaritans (116 123) or your GP for urgent mental health support.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">Coach OS is Coaching, Not Therapy</h2>
      <p>
        Coach OS provides coaching - framework-based support for goals, decisions, and accountability.
        It is designed for people who are generally functioning well and want to improve their performance,
        make better decisions, or achieve specific objectives. It is not a replacement for mental health treatment.
      </p>
    </div>
  )
}

function GROWModelGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        The GROW model is the most widely used coaching framework in the world.
        Developed in the UK in the 1980s, it provides a simple structure for any coaching conversation.
        <strong className="text-white"> Here is how to use it, with specific adaptations for ADHD brains.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">What is GROW?</h2>
      <p>GROW is an acronym for the four stages of a coaching conversation:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">G - Goal:</strong> What do you want to achieve?</li>
        <li><strong className="text-white">R - Reality:</strong> Where are you now?</li>
        <li><strong className="text-white">O - Options:</strong> What could you do?</li>
        <li><strong className="text-white">W - Will:</strong> What will you do?</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Using GROW: Step by Step</h2>

      <h3 className="text-xl font-semibold text-white">G - Goal</h3>
      <p>Start by clarifying what you want to achieve. Good goal questions include:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>What do you want to accomplish?</li>
        <li>What would success look like?</li>
        <li>How will you know when you have achieved it?</li>
        <li>Why is this important to you?</li>
      </ul>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4 mt-4">
        <p className="text-sm"><strong className="text-white">ADHD Adaptation:</strong> Make goals concrete and visual.
        &quot;Finish the project&quot; is too vague. &quot;Have the first draft reviewed by Friday&quot; is specific and measurable.</p>
      </div>

      <h3 className="text-xl font-semibold text-white">R - Reality</h3>
      <p>Explore the current situation honestly:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Where are you now in relation to your goal?</li>
        <li>What have you tried already?</li>
        <li>What is working? What is not?</li>
        <li>What obstacles are you facing?</li>
      </ul>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4 mt-4">
        <p className="text-sm"><strong className="text-white">ADHD Adaptation:</strong> Write down the reality.
        ADHD brains can struggle with objective self-assessment. Getting it on paper makes it tangible.</p>
      </div>

      <h3 className="text-xl font-semibold text-white">O - Options</h3>
      <p>Generate possible paths forward:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>What are all the possible options?</li>
        <li>What else could you do?</li>
        <li>What would you do if there were no constraints?</li>
        <li>What has worked for others in similar situations?</li>
      </ul>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4 mt-4">
        <p className="text-sm"><strong className="text-white">ADHD Adaptation:</strong> Generate options quickly without judging them.
        ADHD creativity shines here. Write everything down, then evaluate separately.</p>
      </div>

      <h3 className="text-xl font-semibold text-white">W - Will</h3>
      <p>Commit to specific actions:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li>What will you do?</li>
        <li>When will you do it?</li>
        <li>How will you hold yourself accountable?</li>
        <li>What might get in the way, and how will you handle it?</li>
      </ul>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4 mt-4">
        <p className="text-sm"><strong className="text-white">ADHD Adaptation:</strong> Make commitments ultra-specific and immediate.
        &quot;Work on marketing&quot; will not happen. &quot;Spend 30 minutes on Monday at 9am writing one blog post&quot; might.</p>
      </div>

      <h2 className="text-2xl font-bold text-white">GROW in Practice</h2>
      <p>
        A typical GROW conversation takes 30-60 minutes. You can use it with a coach, a peer, or even by yourself
        using the questions as prompts. The framework works for goals big and small.
      </p>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">GROW in Coach OS</h3>
        <p>
          Coach OS uses the GROW framework in coaching sessions, guiding you through each stage with relevant questions.
          At the end of each session, the &quot;Will&quot; commitments become tracked action items, ensuring follow-through
          on what you decide.
        </p>
      </div>
    </div>
  )
}

function CoachingFrameworks() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        The best coaches do not just have good instincts - they have proven frameworks.
        <strong className="text-white"> Here are 5 frameworks every entrepreneur should have in their toolkit.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">1. GROW Model</h2>
      <p>
        The most widely used coaching framework. GROW stands for Goal, Reality, Options, Will.
        It provides structure for any conversation about goals or challenges.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Goal setting, problem solving, decision making</p>
      </div>

      <h2 className="text-2xl font-bold text-white">2. SWOT Analysis</h2>
      <p>
        SWOT examines Strengths, Weaknesses, Opportunities, and Threats. It is excellent for strategic planning
        and assessing situations from multiple angles.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Strategic planning, competitive analysis, opportunity assessment</p>
      </div>

      <h2 className="text-2xl font-bold text-white">3. Eisenhower Matrix</h2>
      <p>
        Categorize tasks by urgency and importance into four quadrants: Do First, Schedule, Delegate, Eliminate.
        Helps prioritize when everything feels urgent.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Prioritization, time management, reducing overwhelm</p>
      </div>

      <h2 className="text-2xl font-bold text-white">4. OKRs (Objectives and Key Results)</h2>
      <p>
        Set ambitious Objectives and define measurable Key Results to track progress.
        Used by Google, Intel, and thousands of companies to align effort with outcomes.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Goal tracking, team alignment, measuring progress</p>
      </div>

      <h2 className="text-2xl font-bold text-white">5. Pre-Mortem Analysis</h2>
      <p>
        Before starting a project, imagine it has failed spectacularly. Then work backward to identify
        what could cause that failure. This surfaces risks that optimism bias might hide.
      </p>
      <div className="rounded-lg border border-titanium-700 bg-titanium-900/50 p-4">
        <p className="text-sm"><strong className="text-white">Best for:</strong> Risk assessment, project planning, avoiding preventable failures</p>
      </div>

      <h2 className="text-2xl font-bold text-white">When to Use Which Framework</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">Feeling stuck?</strong> Use GROW to clarify goals and options</li>
        <li><strong className="text-white">Making a big decision?</strong> Use SWOT to see all angles</li>
        <li><strong className="text-white">Overwhelmed by tasks?</strong> Use Eisenhower to prioritize</li>
        <li><strong className="text-white">Setting team goals?</strong> Use OKRs for clarity and alignment</li>
        <li><strong className="text-white">Starting something new?</strong> Use Pre-Mortem to identify risks</li>
      </ul>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Frameworks in Coach OS</h3>
        <p>
          Coach OS guides you through these frameworks in context. When you are stuck, it might suggest GROW.
          When you are planning, it might offer SWOT. The frameworks become tools you use naturally
          rather than theories you have to remember.
        </p>
      </div>
    </div>
  )
}

function FounderLonelinessGuide() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        55% of CEOs experienced mental health issues in 2024. The isolation at the top is real, and it is affecting
        founder performance, wellbeing, and company success. <strong className="text-white">Let us talk about what nobody talks about.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">The Reality of Founder Isolation</h2>
      <p>
        As a founder or CEO, you face challenges you cannot fully share with:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">Your team</strong> - They need confidence, not your anxieties</li>
        <li><strong className="text-white">Your investors</strong> - They need progress reports, not vulnerability</li>
        <li><strong className="text-white">Your family</strong> - They might not understand the specifics</li>
        <li><strong className="text-white">Your friends</strong> - Most have not been where you are</li>
      </ul>
      <p className="mt-4">
        This creates a paradox: the more successful you become, the fewer people you can be honest with.
      </p>

      <h2 className="text-2xl font-bold text-white">The Cost of Isolation</h2>
      <p>
        Founder isolation is not just uncomfortable - it is dangerous:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">Poor decisions</strong> - No one to stress-test your thinking</li>
        <li><strong className="text-white">Blind spots</strong> - Echo chambers reinforce bad patterns</li>
        <li><strong className="text-white">Burnout</strong> - Unsustainable pace without support</li>
        <li><strong className="text-white">Mental health</strong> - Anxiety and depression go unaddressed</li>
        <li><strong className="text-white">Relationship strain</strong> - Partners bear the unprocessed stress</li>
      </ul>

      <h2 className="text-2xl font-bold text-white">Finding the Right Support</h2>

      <h3 className="text-xl font-semibold text-white">Peer Networks</h3>
      <p>
        Groups like YPO, EO, and founder masterminds connect you with people who understand.
        The shared experience creates space for honesty that is hard to find elsewhere.
      </p>

      <h3 className="text-xl font-semibold text-white">Executive Coaches</h3>
      <p>
        A coach provides a confidential thinking partner outside your company. Someone whose only job
        is to help you succeed, with no political agenda or competing interests.
      </p>

      <h3 className="text-xl font-semibold text-white">Therapists</h3>
      <p>
        When founder stress crosses into mental health territory, professional support matters.
        Many founders benefit from having both a coach (for performance) and a therapist (for wellbeing).
      </p>

      <h3 className="text-xl font-semibold text-white">AI Coaching</h3>
      <p>
        Sometimes you need to process something at 2am when you cannot sleep. Or talk through a decision
        before a big meeting. AI coaching provides always-available support without judgment.
      </p>

      <h2 className="text-2xl font-bold text-white">Building Your Support System</h2>
      <ol className="list-decimal space-y-4 pl-6">
        <li>
          <strong className="text-white">Acknowledge the need.</strong> Pretending you do not need support is not strength - it is risk.
        </li>
        <li>
          <strong className="text-white">Identify your gaps.</strong> Where do you need a thinking partner? Where do you need emotional support?
        </li>
        <li>
          <strong className="text-white">Start with one option.</strong> Do not build an elaborate system. Try one thing and see how it helps.
        </li>
        <li>
          <strong className="text-white">Make it regular.</strong> Sporadic support is not support. Build it into your routine.
        </li>
      </ol>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Coach OS for Founders</h3>
        <p>
          Coach OS provides a thinking partner available 24/7. Process decisions, work through challenges,
          and have someone to &quot;talk&quot; to when you cannot share with anyone else. Framework-based coaching
          ensures the support is structured and effective, not just venting.
        </p>
      </div>
    </div>
  )
}

function DecisionMakingFounders() {
  return (
    <div className="space-y-8 text-silver-light">
      <p className="text-xl leading-relaxed">
        Founders make hundreds of decisions every week. The quality of those decisions compounds over time,
        shaping your company&apos;s trajectory. <strong className="text-white">Here is how to make better decisions, faster.</strong>
      </p>

      <h2 className="text-2xl font-bold text-white">The Founder Decision Burden</h2>
      <p>
        As a founder, you face decisions that are:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li><strong className="text-white">High stakes</strong> - Consequences can be significant and long-lasting</li>
        <li><strong className="text-white">High volume</strong> - There are many of them every day</li>
        <li><strong className="text-white">Ambiguous</strong> - Often no clear right answer</li>
        <li><strong className="text-white">Isolated</strong> - You cannot always discuss them openly</li>
      </ul>
      <p className="mt-4">
        This decision burden leads to decision fatigue, analysis paralysis, and sometimes poor choices
        made simply because you are too tired to think clearly.
      </p>

      <h2 className="text-2xl font-bold text-white">Principles for Better Decisions</h2>

      <h3 className="text-xl font-semibold text-white">1. Categorize Decisions by Reversibility</h3>
      <p>
        Amazon&apos;s Jeff Bezos distinguishes between &quot;one-way doors&quot; (irreversible) and &quot;two-way doors&quot; (reversible).
        Spend serious time on one-way doors. Make two-way door decisions quickly and adjust based on results.
      </p>

      <h3 className="text-xl font-semibold text-white">2. Set Decision Deadlines</h3>
      <p>
        &quot;I will decide by Friday&quot; prevents endless rumination. Most decisions are not improved by more time
        beyond a certain point. The cost of delay often exceeds the cost of a suboptimal choice.
      </p>

      <h3 className="text-xl font-semibold text-white">3. Use Frameworks Consistently</h3>
      <p>
        Frameworks like GROW, SWOT, and pre-mortem analysis give you structured ways to think through decisions.
        Using them consistently builds decision-making muscle and reduces the cognitive load of each choice.
      </p>

      <h3 className="text-xl font-semibold text-white">4. Seek Disconfirming Input</h3>
      <p>
        Your brain naturally seeks information that confirms what you already believe. Deliberately seek out
        perspectives and data that challenge your current thinking.
      </p>

      <h3 className="text-xl font-semibold text-white">5. Document and Review</h3>
      <p>
        Keep a decision journal. Note what you decided, why, and what you expected to happen.
        Reviewing past decisions helps you learn from both successes and failures.
      </p>

      <h2 className="text-2xl font-bold text-white">Decision-Making Frameworks</h2>

      <h3 className="text-xl font-semibold text-white">The 10-10-10 Rule</h3>
      <p>
        How will you feel about this decision 10 minutes from now? 10 months from now? 10 years from now?
        This helps balance short-term emotions against long-term impact.
      </p>

      <h3 className="text-xl font-semibold text-white">The Regret Minimization Framework</h3>
      <p>
        Imagine yourself at 80 years old looking back. Which choice would you regret more?
        This surfaces values and long-term preferences that get buried in day-to-day thinking.
      </p>

      <h3 className="text-xl font-semibold text-white">The Newspaper Test</h3>
      <p>
        Imagine your decision appeared on the front page of a newspaper. Would you be comfortable with how it looks?
        This helps identify ethical considerations and reputation risks.
      </p>

      <div className="rounded-lg border border-deep-blue-600/30 bg-deep-blue-900/20 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Coach OS Decision Support</h3>
        <p>
          Coach OS provides a thinking partner for decisions whenever you need one. Using frameworks like GROW,
          it helps you work through choices systematically. Available 24/7, so decision support is there
          at 2am when you cannot sleep, or before that 8am meeting when you need clarity.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white">When to Decide Alone vs. With Input</h2>
      <p>
        Decide alone when:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>The decision is clearly your responsibility</li>
        <li>Speed matters more than buy-in</li>
        <li>You have all the relevant information</li>
      </ul>
      <p className="mt-4">
        Seek input when:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Others have relevant expertise</li>
        <li>Buy-in is crucial for implementation</li>
        <li>You need to check your blind spots</li>
        <li>The stakes are very high</li>
      </ul>
    </div>
  )
}
