import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight } from "../components/ArrowUpRight";

interface AviationStory {
  id: string;
  title: string;
  summary: string;
  category: string;
  createdAt: string;
}

const categories = ["Aircraft", "Plane spotting", "Airline routes", "Community"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

async function errorMessage(response: Response) {
  const result = await response.json() as { error?: string };
  return result.error ?? `News service returned ${response.status}.`;
}

export function NewsPage() {
  const [stories, setStories] = useState<AviationStory[]>([]);
  const [expandedStoryIds, setExpandedStoryIds] = useState<Set<string>>(() => new Set());
  const [selectedCategory, setSelectedCategory] = useState("All news");
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    const query = selectedCategory === "All news" ? "" : `?category=${encodeURIComponent(selectedCategory)}`;
    fetch(`/api/news${query}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(await errorMessage(response));
        return (await response.json()) as AviationStory[];
      })
      .then((items) => {
        if (active) setStories(items);
      })
      .catch((error: unknown) => {
        if (active) setFeedback(error instanceof Error ? `Could not load news: ${error.message}` : "Could not load news.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [selectedCategory]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch("/api/admin/session", {
        headers: { Authorization: `Bearer ${tokenInput}` },
      });
      if (!response.ok) throw new Error(await errorMessage(response));
      setAdminToken(tokenInput);
      setTokenInput("");
      setIsAdmin(true);
      setFeedback("Admin access confirmed. You can now publish news.");
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not verify admin access: ${error.message}` : "Could not verify admin access.");
    }
  }

  function signOut() {
    setAdminToken("");
    setIsAdmin(false);
    setTitle("");
    setSummary("");
    setFeedback("Admin access ended.");
  }

  async function addStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title: title.trim(), summary: summary.trim(), category }),
      });
      if (!response.ok) throw new Error(await errorMessage(response));
      const saved = await response.json() as AviationStory;
      setStories((current) => selectedCategory === "All news" || selectedCategory === saved.category
        ? [saved, ...current]
        : current);
      setTitle("");
      setSummary("");
      setFeedback("News published for the community.");
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not publish news: ${error.message}` : "Could not publish news.");
    }
  }

  async function shareStory(story: AviationStory) {
    const storyText = `${story.title}\n${story.summary}\n${story.category} · Bali Aviation Community`;
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: storyText, url: window.location.href });
        setFeedback("News shared.");
        return;
      }
      await navigator.clipboard.writeText(`${storyText}\n${window.location.href}`);
      setFeedback("News copied to your clipboard.");
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not share this news: ${error.message}` : "Could not share this news.");
    }
  }

  function toggleStory(storyId: string) {
    setExpandedStoryIds((current) => {
      const next = new Set(current);
      if (next.has(storyId)) next.delete(storyId);
      else next.add(storyId);
      return next;
    });
  }

  return (
    <>
      <section className="news-hero">
        <div className="news-hero-orbit" aria-hidden="true" />
        <div className="news-hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> FROM THE BALI AVIATION COMMUNITY</p>
          <h1>What's <span>taking off.</span></h1>
          <p className="hero-copy">The latest aircraft, plane spotting, airline route, and community news from across our aviation world.</p>
        </div>
        <div className="news-hero-index"><span>FLIGHT LOG</span><strong>01</strong><span>NEWS &amp; UPDATES</span></div>
      </section>

      <section className="news-board section-wrap">
        <div className="news-board-heading">
          <div>
            <p className="eyebrow eyebrow--dark">The aviation bulletin</p>
            <h2>News from <span>our skies.</span></h2>
          </div>
          <p>One trusted source for the stories<br />moving aviation forward.</p>
        </div>

        <div className="news-layout">
          <section className="news-feed" aria-labelledby="news-feed-title">
            <div className="news-feed-heading">
              <span id="news-feed-title">LATEST NEWS</span>
              <span>{String(stories.length).padStart(2, "0")} ARTICLES</span>
            </div>
            <div className="news-filters" role="group" aria-label="Filter aviation news by category">
              {["All news", ...categories].map((item) => (
                <button
                  className="news-filter"
                  type="button"
                  key={item}
                  aria-pressed={selectedCategory === item}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="news-empty"><h3>Checking the latest news…</h3></div>
            ) : stories.length === 0 ? (
              <div className="news-empty">
                <span className="news-empty-mark" aria-hidden="true">✳</span>
                <h3>No stories in this category just yet.</h3>
                <p>Choose another news filter and catch up on what&apos;s happening across aviation.</p>
              </div>
            ) : (
              <div className="news-story-list">
                {stories.map((story) => (
                  <article className="news-story" key={story.id}>
                    <div className="news-story-meta">
                      <span className="news-category-tag">{story.category}</span>
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                    <h3>{story.title}</h3>
                    <div className="news-story-actions">
                      <button
                        className="news-share"
                        type="button"
                        aria-expanded={expandedStoryIds.has(story.id)}
                        aria-controls={`news-story-${story.id}`}
                        onClick={() => toggleStory(story.id)}
                      >
                        {expandedStoryIds.has(story.id) ? "Read less" : "Read more"} <ArrowUpRight />
                      </button>
                      <button className="news-share news-share--secondary" type="button" onClick={() => void shareStory(story)}>
                        Share story
                      </button>
                    </div>
                    <div className="news-story-full" id={`news-story-${story.id}`} hidden={!expandedStoryIds.has(story.id)}>
                      <p>{story.summary}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="news-compose">
            <p className="news-compose-kicker"><span>✳</span> EDITORIAL DESK</p>
            {isAdmin ? (
              <>
                <div className="news-admin-heading">
                  <h3>Publish<br />a story.</h3>
                  <button className="news-admin-exit" type="button" onClick={signOut}>Sign out</button>
                </div>
                <p className="news-compose-copy">Only verified editors can publish. Add a clear, factual update for the aviation community.</p>
                <form className="news-form" onSubmit={(event) => void addStory(event)}>
                  <label>
                    Headline
                    <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="What happened?" required />
                  </label>
                  <label>
                    Story
                    <textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={2000} placeholder="Share the news and its context…" required rows={5} />
                  </label>
                  <label>
                    News category
                    <select value={category} onChange={(event) => setCategory(event.target.value)}>
                      {categories.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <button className="button button--amber news-submit" type="submit">
                    Publish news <ArrowUpRight />
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3>News, not noise.</h3>
                <p className="news-compose-copy">Stories are published by our editors to keep the community feed accurate and useful. Readers can browse, filter, and share every article.</p>
                <form className="news-admin-login" onSubmit={(event) => void signIn(event)}>
                  <label htmlFor="admin-token">Editor sign-in</label>
                  <input
                    id="admin-token"
                    type="password"
                    autoComplete="current-password"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    placeholder="Editor access token"
                    required
                  />
                  <button className="news-admin-submit" type="submit">Verify access <ArrowUpRight /></button>
                </form>
              </>
            )}
            <p className="news-local-note">Published stories are shared with every visitor and organized by topic.</p>
            <p className="news-feedback" role="status" aria-live="polite">{feedback}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
