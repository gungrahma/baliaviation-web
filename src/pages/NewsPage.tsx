import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight } from "../components/ArrowUpRight";

type NewsStatus = "tba" | "announced";

interface AviationStory {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: NewsStatus;
  createdAt: string;
}

const categories = ["Community", "Events", "Spotting", "Learning", "Industry"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export function NewsPage() {
  const [stories, setStories] = useState<AviationStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState<NewsStatus>("tba");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/news")
      .then(async (response) => {
        if (!response.ok) throw new Error(`News service returned ${response.status}.`);
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
  }, []);

  async function addStory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newStory = {
      title: title.trim(),
      summary: summary.trim(),
      category,
      status,
    };
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStory),
      });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error ?? `News service returned ${response.status}.`);
      }
      const saved = await response.json() as AviationStory;
      setStories((current) => [saved, ...current]);
      setTitle("");
      setSummary("");
      setStatus("tba");
      setFeedback(status === "tba" ? "Your TBA update has been shared with the community." : "Your announcement has been shared with the community.");
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not post update: ${error.message}` : "Could not post update.");
    }
  }

  async function shareStory(story: AviationStory) {
    const storyText = story.status === "tba"
      ? `${story.title} — TO BE ANNOUNCED\n${story.category} · Bali Aviation Community`
      : `${story.title}\n${story.summary}\n${story.category} · Bali Aviation Community`;
    try {
      if (navigator.share) {
        await navigator.share({ title: story.title, text: storyText, url: window.location.href });
        setFeedback("Your update has been shared.");
        return;
      }
      await navigator.clipboard.writeText(`${storyText}\n${window.location.href}`);
      setFeedback("Update copied to your clipboard.");
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not share this update: ${error.message}` : "Could not share this update.");
    }
  }

  async function toggleStoryStatus(story: AviationStory) {
    const status = story.status === "tba" ? "announced" : "tba";
    try {
      const response = await fetch(`/api/news/${encodeURIComponent(story.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const result = await response.json() as { error?: string };
        throw new Error(result.error ?? `News service returned ${response.status}.`);
      }
      const updated = await response.json() as AviationStory;
      setStories((current) => current.map((item) => item.id === updated.id ? updated : item));
      setFeedback("Update status changed.");
    } catch (error) {
      setFeedback(error instanceof Error ? `Could not update status: ${error.message}` : "Could not update status.");
    }
  }

  return (
    <>
      <section className="news-hero">
        <div className="news-hero-orbit" aria-hidden="true" />
        <div className="news-hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> FROM THE BALI AVIATION COMMUNITY</p>
          <h1>What&apos;s <span>taking off.</span></h1>
          <p className="hero-copy">Community news, upcoming moments, and stories worth sharing from across our aviation world.</p>
        </div>
        <div className="news-hero-index"><span>FLIGHT LOG</span><strong>01</strong><span>NEWS &amp; UPDATES</span></div>
      </section>

      <section className="news-board section-wrap">
        <div className="news-board-heading">
          <div>
            <p className="eyebrow eyebrow--dark">The community bulletin</p>
            <h2>News from <span>our skies.</span></h2>
          </div>
          <p>Have an aviation update to share?<br />Post it here, or save it as a TBA.</p>
        </div>

        <div className="news-layout">
          <section className="news-feed" aria-labelledby="news-feed-title">
            <div className="news-feed-heading">
              <span id="news-feed-title">LATEST UPDATES</span>
              <span>{String(stories.length).padStart(2, "0")} STORIES</span>
            </div>
            {loading ? (
              <div className="news-empty"><h3>Checking the latest updates…</h3></div>
            ) : stories.length === 0 ? (
              <div className="news-empty">
                <span className="news-empty-mark" aria-hidden="true">✳</span>
                <h3>A clear sky for the first story.</h3>
                <p>Be the first to share a community moment, aviation tip, or upcoming event.</p>
              </div>
            ) : (
              <div className="news-story-list">
                {stories.map((story) => (
                  <article className="news-story" key={story.id}>
                    <div className="news-story-meta">
                      <span className={`news-status news-status--${story.status}`}>
                        {story.status === "tba" ? "TBA · TO BE ANNOUNCED" : "ANNOUNCED"}
                      </span>
                      <span>{story.category}</span>
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                    <h3>{story.title}</h3>
                    {story.status === "announced"
                      ? <p>{story.summary}</p>
                      : <p className="news-tba-copy">More details will follow when this update is ready to announce.</p>}
                    <div className="news-story-actions">
                      <button className="news-share" type="button" onClick={() => void shareStory(story)}>
                        Share update <ArrowUpRight />
                      </button>
                      <button className="news-status-action" type="button" onClick={() => void toggleStoryStatus(story)}>
                        {story.status === "tba" ? "Mark as announced" : "Save as TBA"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="news-compose">
            <p className="news-compose-kicker"><span>✳</span> COMMUNITY CONTRIBUTION</p>
            <h3>Put a story<br />out there.</h3>
            <p className="news-compose-copy">Share a moment from the world of aviation. Not ready to reveal the details? Mark it TBA and announce it later.</p>
            <form className="news-form" onSubmit={addStory}>
              <label>
                Story headline
                <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="What’s happening?" required />
              </label>
              <label>
                The details
                <textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={500} placeholder="Share the story in a few sentences…" required rows={4} />
              </label>
              <div className="news-form-row">
                <label>
                  Category
                  <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  Announcement
                  <select value={status} onChange={(event) => setStatus(event.target.value as NewsStatus)}>
                    <option value="tba">TBA — later</option>
                    <option value="announced">Announce now</option>
                  </select>
                </label>
              </div>
              <button className="button button--amber news-submit" type="submit">
                Post update <ArrowUpRight />
              </button>
            </form>
            <p className="news-local-note">Updates are saved for the community by the news service. Sharing uses your device&apos;s share sheet, or copies the text.</p>
            <p className="news-feedback" role="status" aria-live="polite">{feedback}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
