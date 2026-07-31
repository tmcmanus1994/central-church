/**
 * Sitewide facts. NAP consistency matters for local SEO — every rendering of
 * name, address, phone, and service times pulls from here and only here.
 */
export const site = {
  name: "Central Church of Christ",
  shortName: "Central",
  tagline: "Following Jesus Together",
  url: "https://arcentralchurch.org",
  address: {
    street: "823 W 6th St",
    city: "Little Rock",
    state: "AR",
    zip: "72201",
  },
  phone: "(501) 374-2039",
  phoneHref: "tel:+15013742039",
  email: "office@arcentralchurch.org",
  giveUrl: "https://pushpay.com/g/arcentralchurch",
  /** Members-only directory PDF, hosted on Dropbox — linked from the header. */
  memberDirectoryUrl:
    "https://www.dropbox.com/scl/fi/axs346ch938wpnxnd78p9/Directory-May-2026.pdf?rlkey=m2cdjnqk2b18wjkqlbrncxd7q&st=1va59a5d&e=1&dl=0",
  /** Embeddable map for the address — keyless Google Maps embed. */
  mapEmbedUrl:
    "https://www.google.com/maps?q=823+W+6th+St,+Little+Rock,+AR+72201&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Central+Church+of+Christ+823+W+6th+St+Little+Rock+AR+72201",
  socials: {
    instagram: "https://www.instagram.com/lrcentralchurch",
    facebook: "https://www.facebook.com/profile.php?id=61590750088497",
    youtube: "https://www.youtube.com/@CentralChurchLR",
  },
  /**
   * The channel's numeric ID (starts with "UC") — YouTube Studio → Settings
   * → Channel → Advanced settings. Powers `youtubeLiveUrl` below, the
   * permanent link that always resolves to whatever's live right now, or
   * the channel's Live tab when nothing is. Falls back to the handle URL
   * until this is filled in, so a missing ID never breaks a link.
   */
  youtubeChannelId: "UCbDfIXVdizmmKNeiN7kazjw",
  serviceTimes: [
    { label: "Sunday Bible Classes", short: "Bible Classes", when: "9:15 AM" },
    { label: "Sunday Worship", short: "Worship", when: "10:15 AM" },
    {
      label: "Spanish Worship",
      short: "Adoración en Español",
      when: "1:30 PM",
    },
    {
      label: "Wednesday Classes",
      short: "Wednesday Classes",
      when: "6:30 PM",
    },
  ],
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

/**
 * Every "Watch Live" CTA on the site points here instead of embedding a
 * player — people engage with the stream better on YouTube itself
 * (comments, likes, subscriptions). `/channel/{id}/live` always resolves to
 * the current stream when Central is live, and to the channel's Live tab
 * otherwise, so no scheduling data or polling is needed for it to work.
 */
export const youtubeLiveUrl = site.youtubeChannelId
  ? `https://www.youtube.com/channel/${site.youtubeChannelId}/live`
  : site.socials.youtube;
