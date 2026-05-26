// screens-more.js — injects remaining screens (editor, availability,
// integrations, public flow, manage) into the app shell.

(function () {
  const html = `
    <!-- ──────────────────────────────────────────────── -->
    <!-- 4. ADMIN — EVENT TYPE EDITOR (custom questions)  -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="04 Event type editor" id="screen-admin-editor">
      <div class="app-shell">
        <div data-sidebar data-active="admin-events"></div>
        <section class="workspace">
          <header class="topbar">
            <div>
              <a href="#" onclick="event.preventDefault(); go('admin-events')" style="display: inline-flex; align-items: center; gap: 4px; color: var(--muted); font-size: 12.5px; font-weight: 500; margin-bottom: 10px;">
                <svg width="14" height="14"><use href="#i-arrow-left" /></svg>
                All event types
              </a>
              <h2>Product demo call</h2>
              <p class="subtitle">bookly.io/you/demo · 45 min · Zoom</p>
            </div>
            <div class="topbar-right">
              <button class="btn btn-secondary" type="button" onclick="go('public-pick')">
                <svg width="14" height="14"><use href="#i-eye" /></svg>
                Preview
              </button>
              <button class="btn btn-secondary" type="button">Discard</button>
              <button class="btn btn-primary" type="button">Save changes</button>
            </div>
          </header>

          <div class="tabs" style="margin: -8px 0 0;">
            <button class="tab active">Event setup</button>
            <button class="tab">Limits</button>
            <button class="tab">Questions <span class="count">5</span></button>
            <button class="tab">Reminders</button>
            <button class="tab">Workflows</button>
          </div>

          <div style="display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 24px;">
            <!-- Left: main editor -->
            <div style="display: flex; flex-direction: column; gap: 18px;">
              <section class="panel">
                <div class="panel-head"><div><h3>Event details</h3></div></div>
                <div class="panel-body" style="display: grid; gap: 14px;">
                  <div class="field">
                    <label>Title</label>
                    <input value="Product demo call" />
                  </div>
                  <div class="field">
                    <label>Description</label>
                    <textarea>A live walk-through of Bookly for your team. We'll cover scheduling, calendar integrations, custom questions, and answer anything specific to your workflow.</textarea>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div class="field">
                      <label>Duration</label>
                      <select>
                        <option>15 minutes</option>
                        <option>20 minutes</option>
                        <option>25 minutes</option>
                        <option>30 minutes</option>
                        <option selected>45 minutes</option>
                        <option>60 minutes</option>
                        <option>Custom…</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>Type</label>
                      <select>
                        <option selected>One-on-one</option>
                        <option>Round robin</option>
                        <option>Group (multiple invitees)</option>
                        <option>Collective</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>Location</label>
                      <select>
                        <option>Google Meet</option>
                        <option selected>Zoom</option>
                        <option>Microsoft Teams</option>
                        <option>In-person</option>
                        <option>Phone call</option>
                      </select>
                    </div>
                  </div>
                  <div class="field">
                    <label>Public URL</label>
                    <div style="display: flex; align-items: stretch; border: 1px solid var(--line); border-radius: var(--radius-sm); overflow: hidden;">
                      <span style="padding: 0 12px; display: grid; place-items: center; background: var(--surface-2); border-right: 1px solid var(--line); color: var(--muted); font-size: 13px; font-family: var(--font-mono);">bookly.io/you/</span>
                      <input style="border: 0; border-radius: 0; flex: 1;" value="demo" />
                      <button class="btn btn-ghost" type="button" style="height: 38px; border-radius: 0; border-left: 1px solid var(--line); padding: 0 12px;">
                        <svg width="14" height="14"><use href="#i-copy" /></svg>
                      </button>
                    </div>
                    <span class="hint">This is the link you'll share with invitees.</span>
                  </div>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head">
                  <div>
                    <h3>Booking form</h3>
                    <div class="subtitle">Custom questions invitees answer when they book.</div>
                  </div>
                  <button class="btn btn-secondary btn-sm" type="button">
                    <svg width="12" height="12"><use href="#i-plus" /></svg>
                    Add question
                  </button>
                </div>
                <div class="panel-body">
                  <div class="question-list">
                    <div class="question-row">
                      <svg class="q-handle" width="18" height="18"><use href="#i-handle" /></svg>
                      <div class="q-info">
                        <div class="q-label">Your name <span style="color: #ef4444;">*</span></div>
                        <div class="q-meta">
                          <span class="q-type-badge">Text</span>
                          <span>Built-in · required</span>
                        </div>
                      </div>
                      <div style="display: flex; gap: 4px;">
                        <span class="toggle on" data-toggle></span>
                        <button class="btn btn-icon" disabled style="opacity: 0.4;"><svg width="15" height="15"><use href="#i-trash" /></svg></button>
                      </div>
                    </div>
                    <div class="question-row">
                      <svg class="q-handle" width="18" height="18"><use href="#i-handle" /></svg>
                      <div class="q-info">
                        <div class="q-label">Email <span style="color: #ef4444;">*</span></div>
                        <div class="q-meta">
                          <span class="q-type-badge">Email</span>
                          <span>Built-in · required</span>
                        </div>
                      </div>
                      <div style="display: flex; gap: 4px;">
                        <span class="toggle on" data-toggle></span>
                        <button class="btn btn-icon" disabled style="opacity: 0.4;"><svg width="15" height="15"><use href="#i-trash" /></svg></button>
                      </div>
                    </div>
                    <div class="question-row">
                      <svg class="q-handle" width="18" height="18"><use href="#i-handle" /></svg>
                      <div class="q-info">
                        <div class="q-label">Company name</div>
                        <div class="q-meta">
                          <span class="q-type-badge">Text</span>
                          <span>Optional</span>
                        </div>
                      </div>
                      <div style="display: flex; gap: 4px;">
                        <span class="toggle on" data-toggle></span>
                        <button class="btn btn-icon"><svg width="15" height="15"><use href="#i-trash" /></svg></button>
                      </div>
                    </div>
                    <div class="question-row">
                      <svg class="q-handle" width="18" height="18"><use href="#i-handle" /></svg>
                      <div class="q-info">
                        <div class="q-label">Team size <span style="color: #ef4444;">*</span></div>
                        <div class="q-meta">
                          <span class="q-type-badge">Select</span>
                          <span>1–10 · 11–50 · 51–200 · 200+</span>
                        </div>
                      </div>
                      <div style="display: flex; gap: 4px;">
                        <span class="toggle on" data-toggle></span>
                        <button class="btn btn-icon"><svg width="15" height="15"><use href="#i-trash" /></svg></button>
                      </div>
                    </div>
                    <div class="question-row">
                      <svg class="q-handle" width="18" height="18"><use href="#i-handle" /></svg>
                      <div class="q-info">
                        <div class="q-label">What would you like to cover in the demo?</div>
                        <div class="q-meta">
                          <span class="q-type-badge">Long text</span>
                          <span>Optional</span>
                        </div>
                      </div>
                      <div style="display: flex; gap: 4px;">
                        <span class="toggle on" data-toggle></span>
                        <button class="btn btn-icon"><svg width="15" height="15"><use href="#i-trash" /></svg></button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right: settings -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <section class="panel">
                <div class="panel-head"><h3>Visibility</h3></div>
                <div class="panel-body" style="display: flex; flex-direction: column; gap: 12px; padding: 18px 22px;">
                  <label style="display: flex; align-items: center; gap: 10px; font-size: 13px;">
                    <span class="toggle on" data-toggle></span>
                    <span>
                      <strong style="font-weight: 600;">Public</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">Listed on your booking page.</div>
                    </span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 10px; font-size: 13px;">
                    <span class="toggle" data-toggle></span>
                    <span>
                      <strong style="font-weight: 600;">Require approval</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">You confirm each booking before it's added to your calendar.</div>
                    </span>
                  </label>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h3>Limits</h3></div>
                <div class="panel-body" style="display: flex; flex-direction: column; gap: 10px; padding: 18px 22px; font-size: 13px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--muted);">Min. notice</span>
                    <strong style="font-weight: 600;">2 hours</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--muted);">Max. days in advance</span>
                    <strong style="font-weight: 600;">60 days</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--muted);">Buffer before</span>
                    <strong style="font-weight: 600;">5 min</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--muted);">Buffer after</span>
                    <strong style="font-weight: 600;">10 min</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--muted);">Daily cap</span>
                    <strong style="font-weight: 600;">6 demos</strong>
                  </div>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head"><h3>Reminders</h3></div>
                <div class="panel-body" style="display: flex; flex-direction: column; gap: 10px; padding: 18px 22px; font-size: 13px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="16" height="16" style="color: var(--accent);"><use href="#i-mail" /></svg>
                    <div>
                      <strong style="font-weight: 600;">24 hours before</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">Email reminder to invitee.</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="16" height="16" style="color: var(--accent);"><use href="#i-bell" /></svg>
                    <div>
                      <strong style="font-weight: 600;">1 hour before</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">Email + push reminder.</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="16" height="16" style="color: var(--accent);"><use href="#i-check" /></svg>
                    <div>
                      <strong style="font-weight: 600;">Right after booking</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">Confirmation email with meeting link.</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- ──────────────────────────────────────────────── -->
    <!-- 5. ADMIN — AVAILABILITY                          -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="05 Availability" id="screen-admin-availability">
      <div class="app-shell">
        <div data-sidebar data-active="admin-availability"></div>
        <section class="workspace">
          <header class="topbar">
            <div>
              <h2>Availability</h2>
              <p class="subtitle">Set your weekly working hours. Bookly only offers times when you're free across every connected calendar.</p>
            </div>
            <div class="topbar-right">
              <button class="btn btn-secondary" type="button">
                <svg width="14" height="14"><use href="#i-copy" /></svg>
                Duplicate schedule
              </button>
              <button class="btn btn-primary" type="button">Save changes</button>
            </div>
          </header>

          <div style="display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px;">
            <section class="panel">
              <div class="panel-head">
                <div>
                  <h3>Weekly hours</h3>
                  <div class="subtitle">Default schedule · Mon–Fri</div>
                </div>
                <button class="btn btn-secondary btn-sm" type="button">
                  Default schedule
                  <svg width="12" height="12"><use href="#i-chev-down" /></svg>
                </button>
              </div>
              <div class="schedule-list">
                <div class="schedule-day">
                  <div class="day-label"><span class="toggle on" data-toggle></span><strong>Monday</strong></div>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="range-row">
                      <input class="range-input" value="09:00" />
                      <span class="range-sep">–</span>
                      <input class="range-input" value="12:00" />
                      <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                    </div>
                    <div class="range-row">
                      <input class="range-input" value="13:00" />
                      <span class="range-sep">–</span>
                      <input class="range-input" value="17:00" />
                      <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                    </div>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-icon" title="Add range"><svg width="14" height="14"><use href="#i-plus" /></svg></button>
                    <button class="btn btn-icon" title="Copy to other days"><svg width="14" height="14"><use href="#i-copy" /></svg></button>
                  </div>
                </div>

                <div class="schedule-day">
                  <div class="day-label"><span class="toggle on" data-toggle></span><strong>Tuesday</strong></div>
                  <div class="range-row">
                    <input class="range-input" value="09:00" />
                    <span class="range-sep">–</span>
                    <input class="range-input" value="17:00" />
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-plus" /></svg></button>
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-copy" /></svg></button>
                  </div>
                </div>

                <div class="schedule-day">
                  <div class="day-label"><span class="toggle on" data-toggle></span><strong>Wednesday</strong></div>
                  <div class="range-row">
                    <input class="range-input" value="09:00" />
                    <span class="range-sep">–</span>
                    <input class="range-input" value="17:00" />
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-plus" /></svg></button>
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-copy" /></svg></button>
                  </div>
                </div>

                <div class="schedule-day">
                  <div class="day-label"><span class="toggle on" data-toggle></span><strong>Thursday</strong></div>
                  <div class="range-row">
                    <input class="range-input" value="09:00" />
                    <span class="range-sep">–</span>
                    <input class="range-input" value="12:00" />
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-plus" /></svg></button>
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-copy" /></svg></button>
                  </div>
                </div>

                <div class="schedule-day">
                  <div class="day-label"><span class="toggle on" data-toggle></span><strong>Friday</strong></div>
                  <div class="range-row">
                    <input class="range-input" value="09:00" />
                    <span class="range-sep">–</span>
                    <input class="range-input" value="15:00" />
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                  </div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-plus" /></svg></button>
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-copy" /></svg></button>
                  </div>
                </div>

                <div class="schedule-day off">
                  <div class="day-label"><span class="toggle" data-toggle></span><strong>Saturday</strong></div>
                  <span class="unavailable">Unavailable</span>
                  <div></div>
                </div>
                <div class="schedule-day off">
                  <div class="day-label"><span class="toggle" data-toggle></span><strong>Sunday</strong></div>
                  <span class="unavailable">Unavailable</span>
                  <div></div>
                </div>
              </div>
            </section>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              <section class="panel">
                <div class="panel-head"><h3>Timezone</h3></div>
                <div class="panel-body" style="padding: 18px 22px;">
                  <div class="field">
                    <select>
                      <option selected>Europe/Lisbon (UTC+1)</option>
                      <option>Europe/London (UTC+0)</option>
                      <option>America/New_York (UTC−4)</option>
                      <option>America/Los_Angeles (UTC−7)</option>
                      <option>Asia/Tokyo (UTC+9)</option>
                    </select>
                    <span class="hint">Times shown to invitees are auto-converted to their detected timezone.</span>
                  </div>
                </div>
              </section>

              <section class="panel">
                <div class="panel-head">
                  <div>
                    <h3>Date overrides</h3>
                    <div class="subtitle">Block off vacation, holidays, or specific dates.</div>
                  </div>
                </div>
                <div class="panel-body" style="padding: 14px 22px; display: flex; flex-direction: column; gap: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 8px 0; border-bottom: 1px solid var(--line-soft);">
                    <div>
                      <strong style="font-weight: 600;">Fri, 23 May</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">Unavailable all day</div>
                    </div>
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 8px 0; border-bottom: 1px solid var(--line-soft);">
                    <div>
                      <strong style="font-weight: 600;">Mon, 26 May</strong>
                      <div style="color: var(--muted); font-size: 12px; margin-top: 2px;">14:00 – 18:00 only</div>
                    </div>
                    <button class="btn btn-icon"><svg width="14" height="14"><use href="#i-x" /></svg></button>
                  </div>
                  <button class="btn btn-secondary btn-sm" type="button" style="align-self: flex-start;">
                    <svg width="12" height="12"><use href="#i-plus" /></svg>
                    Add an override
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- ──────────────────────────────────────────────── -->
    <!-- 6. ADMIN — INTEGRATIONS / CONFLICTS              -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="06 Integrations" id="screen-admin-integrations">
      <div class="app-shell">
        <div data-sidebar data-active="admin-integrations"></div>
        <section class="workspace">
          <header class="topbar">
            <div>
              <h2>Integrations</h2>
              <p class="subtitle">Connect your calendars to check for conflicts, and your video tools to auto-create meeting links.</p>
            </div>
          </header>

          <section class="panel">
            <div class="panel-head">
              <div>
                <h3>Conflict checking</h3>
                <div class="subtitle">Bookly will not offer a time that overlaps with anything on these calendars.</div>
              </div>
              <span class="pill" style="background: var(--success-soft); color: var(--success); border-color: transparent;">
                <svg style="color: var(--success);" width="12" height="12"><use href="#i-check" /></svg>
                All systems synced
              </span>
            </div>
            <div class="panel-body" style="padding: 14px 22px 22px;">
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius);">
                  <div class="integration-logo google" style="width: 32px; height: 32px; font-size: 13px;">G</div>
                  <div>
                    <div style="font-size: 13.5px; font-weight: 600;">your@email.com</div>
                    <div style="font-size: 11.5px; color: var(--muted); margin-top: 2px;">Google Calendar · checks for conflicts</div>
                  </div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="pill accent" style="background: var(--accent-soft); color: var(--accent-text);">Primary · creates events</span>
                    <button class="btn btn-secondary btn-sm">Manage</button>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius);">
                  <div class="integration-logo google" style="width: 32px; height: 32px; font-size: 13px;">G</div>
                  <div>
                    <div style="font-size: 13.5px; font-weight: 600;">personal@gmail.com</div>
                    <div style="font-size: 11.5px; color: var(--muted); margin-top: 2px;">Google Calendar · checks for conflicts</div>
                  </div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="toggle on" data-toggle></span>
                    <button class="btn btn-secondary btn-sm">Manage</button>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius);">
                  <div class="integration-logo outlook" style="width: 32px; height: 32px; font-size: 13px;">O</div>
                  <div>
                    <div style="font-size: 13.5px; font-weight: 600;">work@company.com</div>
                    <div style="font-size: 11.5px; color: var(--muted); margin-top: 2px;">Outlook · checks for conflicts</div>
                  </div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span class="toggle on" data-toggle></span>
                    <button class="btn btn-secondary btn-sm">Manage</button>
                  </div>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" type="button" style="margin-top: 14px;">
                <svg width="12" height="12"><use href="#i-plus" /></svg>
                Connect another calendar
              </button>
            </div>
          </section>

          <section>
            <div style="margin-bottom: 12px;">
              <h3 style="font-size: 14px; font-weight: 600;">Available integrations</h3>
              <p style="margin-top: 4px; font-size: 12.5px; color: var(--muted);">Calendars and video tools that work out of the box.</p>
            </div>
            <div class="integration-grid">
              ${[
                ["Google Calendar", "google", "G", "Conflict check + auto-create events on your calendar.", "connected", "2 accounts connected"],
                ["Outlook Calendar", "outlook", "O", "Microsoft 365 and Outlook.com calendars.", "connected", "1 account connected"],
                ["Apple Calendar", "apple", "🍎", "Sync via CalDAV for iCloud and macOS calendars.", "disconnected", "Not connected"],
                ["Google Meet", "meet", "M", "Auto-generate a Meet link for every booking.", "connected", "Connected"],
                ["Zoom", "zoom", "Z", "Auto-create unique Zoom meetings for each booking.", "connected", "Connected"],
                ["Microsoft Teams", "teams", "T", "Create Teams meetings on confirmation.", "disconnected", "Not connected"],
              ].map(([name, cls, glyph, desc, status, foot]) => `
                <div class="integration-card">
                  <div class="integration-head">
                    <div class="integration-logo ${cls}">${glyph}</div>
                    <div>
                      <div class="integration-name">${name}</div>
                      <div class="integration-status ${status}">${status === "connected" ? "Connected" : "Not connected"}</div>
                    </div>
                  </div>
                  <div class="integration-desc">${desc}</div>
                  <div class="integration-foot">
                    <span class="accounts">${foot}</span>
                    <button class="btn btn-secondary btn-sm" type="button">${status === "connected" ? "Manage" : "Connect"}</button>
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
        </section>
      </div>
    </section>

    <!-- ──────────────────────────────────────────────── -->
    <!-- 7. PUBLIC — PICK A TIME                          -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="07 Public — Pick a time" id="screen-public-pick">
      <main class="public-shell">
        <article class="public-card">
          <aside class="public-left">
            <div class="pub-logo">
              <span class="brand-mark">B</span>
              <span>Bookly</span>
            </div>
            <div class="pub-profile">
              <div class="role">Your Name · your role</div>
              <h1>Book a session</h1>
            </div>
            <div class="session-card">
              <div class="session-head">
                <span class="session-name">Your Event</span>
                <span class="free-badge">Free</span>
              </div>
              <p class="session-desc">Select a date and time that works for you.</p>
              <div class="session-meta">
                <div class="row"><svg><use href="#i-clock" /></svg><strong>45 minutes</strong></div>
                <div class="row"><svg><use href="#i-video" /></svg>Google Meet · link in invite</div>
                <div class="row"><svg><use href="#i-globe" /></svg>Open to anyone, worldwide</div>
              </div>
            </div>
            <div class="pub-foot">Powered by <strong>Bookly</strong></div>
          </aside>

          <section class="public-right">
            <div>
              <h2>Pick a time</h2>
              <div class="step-sub">Select a date, then choose a time that works for you.</div>
            </div>

            <button class="tz-row" type="button" id="tz-display">
              <svg><use href="#i-globe" /></svg>
              <span id="tz-name">Detecting…</span>
              <span class="auto" id="tz-auto">Auto</span>
              <svg class="chev" width="14" height="14"><use href="#i-chev-down" /></svg>
            </button>

            <div class="pick-grid">
              <div class="calendar-block">
                <div class="month-head">
                  <strong id="cal-month-label">Loading…</strong>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-icon" type="button" id="cal-prev"><svg width="16" height="16"><use href="#i-chev-left" /></svg></button>
                    <button class="btn btn-icon" type="button" id="cal-next"><svg width="16" height="16"><use href="#i-chev-right" /></svg></button>
                  </div>
                </div>
                <div class="weekdays">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div class="calendar" id="public-cal"></div>
              </div>

              <div class="slot-col">
                <div class="slot-col-head" id="public-slot-day">Select a date</div>
                <div class="slot-col-sub">Times shown in your timezone</div>
                <div class="slot-list" id="public-slot-list">
                  <p style="font-size:13px;color:var(--muted);padding:8px 0;">Pick a date on the left to see available times.</p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </section>

    <!-- ──────────────────────────────────────────────── -->
    <!-- 8. PUBLIC — DETAILS FORM (custom questions)      -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="08 Public — Details" id="screen-public-form">
      <main class="public-shell">
        <article class="public-card">
          <aside class="public-left">
            <div class="pub-logo">
              <span class="brand-mark">B</span>
              <span>Bookly</span>
            </div>
            <div class="pub-profile">
              <div class="role">Your Name · your role</div>
              <h1>Book a session</h1>
            </div>
            <div class="session-card">
              <div class="session-head">
                <span class="session-name">Your Event</span>
                <span class="free-badge">Free</span>
              </div>
              <p class="session-desc">Enter your details below to confirm your booking.</p>
              <div class="session-meta">
                <div class="row"><svg><use href="#i-clock" /></svg><strong>45 minutes</strong></div>
                <div class="row"><svg><use href="#i-video" /></svg>Google Meet</div>
              </div>
              <div class="summary-mini">
                <div class="line"><svg><use href="#i-cal" /></svg><strong data-form-date>Tue, 12 May 2026</strong></div>
                <div class="line"><svg><use href="#i-clock" /></svg><strong data-form-time>10:30 – 11:15</strong></div>
                <div class="line" style="font-size: 11.5px; opacity: 0.85;"><svg><use href="#i-globe" /></svg><span id="tz-name-form">Your timezone</span></div>
              </div>
            </div>
            <div class="pub-foot">Powered by <strong>Bookly</strong></div>
          </aside>

          <section class="public-right">
            <div>
              <h2>Enter your details</h2>
              <div class="step-sub">We'll send the meeting link to your email right after you confirm.</div>
            </div>

            <form class="confirm-form" id="booking-confirm-form" novalidate onsubmit="event.preventDefault(); submitBooking(this);">
              <div class="field">
                <label>Your name <span class="req">*</span></label>
                <input type="text" placeholder="Your full name" required />
              </div>

              <div class="field">
                <label>Email <span class="req">*</span></label>
                <input type="email" placeholder="you@example.com" required />
              </div>

              <div class="field">
                <label>Company name</label>
                <input type="text" placeholder="Your company (optional)" />
              </div>

              <div class="field">
                <label>Team size <span class="req">*</span></label>
                <select required>
                  <option>1–10 people</option>
                  <option selected>11–50 people</option>
                  <option>51–200 people</option>
                  <option>200+ people</option>
                </select>
              </div>

              <div class="field">
                <label>Anything you'd like the host to know?</label>
                <textarea rows="3" placeholder="Optional message…"></textarea>
                <span class="hint">This helps the host prepare for your session.</span>
              </div>

              <div class="field">
                <label>Add guests <span style="color: var(--faint); font-weight: 500;">(optional)</span></label>
                <input type="text" placeholder="email@example.com, email2@example.com" />
              </div>

              <div class="confirm-actions">
                <button type="button" class="btn btn-secondary" onclick="go('public-pick')">
                  <svg width="14" height="14"><use href="#i-arrow-left" /></svg>
                  Back
                </button>
                <button class="btn btn-primary" type="submit">
                  <svg width="14" height="14"><use href="#i-check" /></svg>
                  Confirm booking
                </button>
                <span class="legal">By confirming, you agree to Bookly's Terms and Privacy Policy.</span>
              </div>
            </form>
          </section>
        </article>
      </main>
    </section>

    <!-- ──────────────────────────────────────────────── -->
    <!-- 9. PUBLIC — CONFIRMED + EMAIL PREVIEW            -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="09 Confirmed" id="screen-public-done">
      <main class="public-shell" style="padding: 40px 20px; gap: 28px;">
        <article class="public-card" style="width: min(640px, 100%); grid-template-columns: 1fr;">
          <section class="public-right" style="text-align: center; align-items: center; padding: 40px 32px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--success-soft); color: var(--success); display: grid; place-items: center;">
              <svg width="32" height="32"><use href="#i-check" /></svg>
            </div>
            <div style="text-align: center;">
              <h2 style="font-size: 24px;">You're booked!</h2>
              <div class="step-sub">A calendar invite is on its way to your inbox.</div>
            </div>
            <div style="display: grid; grid-template-columns: auto 1fr; column-gap: 12px; row-gap: 10px; padding: 18px 20px; border-radius: var(--radius); border: 1px solid var(--line); background: var(--surface-2); width: 100%; max-width: 480px; text-align: left; font-size: 13.5px;">
              <svg width="16" height="16" style="color: var(--muted); margin-top: 2px;"><use href="#i-cal" /></svg>
              <strong data-confirm-date style="font-weight: 600;">—</strong>

              <svg width="16" height="16" style="color: var(--muted); margin-top: 2px;"><use href="#i-clock" /></svg>
              <span><strong data-confirm-time style="font-weight: 600;">—</strong> <span style="color: var(--muted); font-size: 12.5px;" id="tz-name-done">Your timezone</span></span>

              <svg width="16" height="16" style="color: var(--muted); margin-top: 2px;"><use href="#i-video" /></svg>
              <span><a data-confirm-location href="#" style="color: var(--accent); font-weight: 600;">Google Meet</a> <span style="color: var(--muted); font-size: 12.5px;">· link in your email</span></span>

              <svg width="16" height="16" style="color: var(--muted); margin-top: 2px;"><use href="#i-mail" /></svg>
              <span style="min-width: 0;"><span style="color: var(--muted); font-size: 12.5px;">Sent to</span> <strong data-confirm-email style="font-weight: 600;">your@email.com</strong></span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" type="button" onclick="go('manage')">
                <svg width="14" height="14"><use href="#i-settings" /></svg>
                Manage booking
              </button>
              <button class="btn btn-primary" type="button">
                <svg width="14" height="14"><use href="#i-cal" /></svg>
                Add to calendar
              </button>
            </div>
            <div style="font-size: 12px; color: var(--muted); margin-top: 6px;">We'll send a reminder 24 hours and 1 hour before the meeting.</div>
          </section>
        </article>

        <!-- Email preview -->
        <div style="width: min(640px, 100%);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 12px; color: var(--muted); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;">
            <svg width="14" height="14"><use href="#i-mail" /></svg>
            Confirmation email preview
          </div>
          <div class="email-preview">
            <div class="email-head">
              <div class="email-meta">
                <span>From: Your Name via Bookly &lt;hi@bookly.io&gt;</span>
                <span data-email-to>To: your@email.com</span>
              </div>
              <div class="email-subject" data-email-subject>Your booking is confirmed</div>
            </div>
            <div class="email-body">
              <h3 data-email-greeting>Hi there — you're booked!</h3>
              <p data-email-intro>Thanks for booking. The meeting is on your calendar and ours. Here are the details:</p>
              <div class="event-box">
                <div class="row"><svg><use href="#i-cal" /></svg><strong data-email-date>—</strong></div>
                <div class="row"><svg><use href="#i-clock" /></svg><strong data-email-time>—</strong> · <span data-email-tz>Your timezone</span></div>
                <div class="row"><svg><use href="#i-video" /></svg><span data-email-location>Meeting link in your invite</span></div>
                <div class="row"><svg><use href="#i-users" /></svg><span data-email-attendees>Host &amp; Guest</span></div>
              </div>
              <p>We'll send a reminder 24 hours and 1 hour before. If something comes up, you can reschedule or cancel without back-and-forth:</p>
              <div class="actions">
                <a class="btn-link primary" href="#">Add to calendar</a>
                <a class="btn-link secondary" href="#" onclick="event.preventDefault(); go('manage');">Reschedule or cancel</a>
              </div>
              <p style="color: var(--muted); font-size: 12.5px; margin-top: 24px;">— The Bookly team</p>
            </div>
          </div>
        </div>
      </main>
    </section>

    <!-- ──────────────────────────────────────────────── -->
    <!-- 10. MANAGE BOOKING (reschedule / cancel)         -->
    <!-- ──────────────────────────────────────────────── -->
    <section class="screen" data-screen-label="10 Manage" id="screen-manage">
      <main class="public-shell" style="padding: 60px 20px;">
        <div class="manage-card">
          <div class="manage-banner">
            <div class="session-name" data-manage-event>Your booking</div>
            <h1 data-manage-datetime>—</h1>
            <div class="when">
              <span><svg width="14" height="14"><use href="#i-clock" /></svg>45 minutes</span>
              <span><svg width="14" height="14"><use href="#i-globe" /></svg><span id="tz-name-manage">Europe/Lisbon</span></span>
            </div>
          </div>

          <div class="manage-body">
            <div class="manage-meta-list">
              <div class="row">
                <svg><use href="#i-video" /></svg>
                <div style="flex: 1; min-width: 0;">
                  <strong style="display: block;">Google Meet</strong>
                  <span style="font-size: 11.5px; word-break: break-all;">meet.google.com/xyz-abcd-efg</span>
                </div>
              </div>
              <div class="row">
                <svg><use href="#i-users" /></svg>
                <div style="flex: 1; min-width: 0;">
                  <strong style="display: block;" data-manage-name>Guest</strong>
                  <span style="font-size: 11.5px;" data-manage-email>—</span>
                </div>
              </div>
              <div class="row">
                <svg><use href="#i-bell" /></svg>
                <div style="flex: 1; min-width: 0;">
                  <strong style="display: block;">Reminders scheduled</strong>
                  <span style="font-size: 11.5px;">24 hours and 1 hour before</span>
                </div>
              </div>
            </div>

            <div class="manage-actions">
              <button class="btn btn-secondary btn-lg" type="button" onclick="go('public-pick')">
                <svg width="15" height="15"><use href="#i-refresh" /></svg>
                Reschedule
              </button>
              <button class="btn btn-danger btn-lg" type="button" onclick="cancelBooking()">
                <svg width="15" height="15"><use href="#i-trash" /></svg>
                Cancel booking
              </button>
            </div>

            <div class="manage-cancel-pane" id="cancel-pane" hidden>
              <h4>Are you sure you want to cancel?</h4>
              <p>This will free up the slot on the host's calendar. Both you and the host will be notified by email.</p>
              <div class="field" style="margin: 12px 0;">
                <label style="color: var(--danger);">Reason (optional)</label>
                <textarea rows="2" placeholder="Something came up at work…" style="background: white;"></textarea>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary" type="button" onclick="document.getElementById('cancel-pane').hidden = true;">Never mind</button>
                <button class="btn" type="button" style="background: var(--danger); color: white; border-color: var(--danger);" onclick="go('cancelled')">Confirm cancel</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>

    <!-- 11. Cancelled state (hidden from nav; reached from Manage) -->
    <section class="screen" data-screen-label="11 Cancelled" id="screen-cancelled">
      <main class="public-shell" style="padding: 60px 20px;">
        <div class="cancelled-state">
          <div class="ico"><svg width="28" height="28"><use href="#i-x" /></svg></div>
          <h2>Booking cancelled</h2>
          <p>Your booking has been cancelled. The host has been notified — you'll receive an email confirmation shortly.</p>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 18px;">
            <button class="btn btn-secondary" type="button" onclick="go('public-pick')">
              <svg width="14" height="14"><use href="#i-cal" /></svg>
              Book another time
            </button>
          </div>
        </div>
      </main>
    </section>
  `;

  // Inject
  const anchor = document.getElementById("more-screens-anchor");
  if (anchor) {
    anchor.insertAdjacentHTML("afterend", html);
  }

  // ──────────────────────────────────────────────────
  // Timezone autodetect for the public flow
  // ──────────────────────────────────────────────────
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Lisbon";
  const offsetMins = -new Date().getTimezoneOffset();
  const sign = offsetMins >= 0 ? "+" : "−";
  const absH = String(Math.floor(Math.abs(offsetMins) / 60));
  const absM = String(Math.abs(offsetMins) % 60).padStart(2, "0");
  const offStr = absM === "00" ? `UTC${sign}${absH}` : `UTC${sign}${absH}:${absM}`;
  const display = `${tz.replace(/_/g, " ")} (${offStr})`;

  document.querySelectorAll("#tz-name, #tz-name-form, #tz-name-done, #tz-name-manage").forEach(el => {
    el.textContent = display;
  });

  // ──────────────────────────────────────────────────
  // Dynamic calendar
  // ──────────────────────────────────────────────────
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAY_SHORT   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Days blocked as "unavailable" (0=Sun,6=Sat always blocked; this adds Wed off)
  const BLOCKED_DOW = new Set([0, 3, 6]); // Sun, Wed, Sat

  let calYear, calMonth;
  (function initCal() {
    const now = new Date();
    calYear  = now.getFullYear();
    calMonth = now.getMonth();
  })();

  function buildCalendar(year, month) {
    const today     = new Date(); today.setHours(0,0,0,0);
    const firstDay  = new Date(year, month, 1);
    const lastDay   = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    // Start on Monday (getDay: 0=Sun → shift to Mon-based)
    const startDow  = (firstDay.getDay() + 6) % 7;
    const prevLast  = new Date(year, month, 0).getDate();

    let html = "";
    // Prev-month padding
    for (let i = startDow - 1; i >= 0; i--) {
      html += `<button class="cal-cell muted" disabled>${prevLast - i}</button>`;
    }
    // Current month
    for (let d = 1; d <= totalDays; d++) {
      const date   = new Date(year, month, d);
      const isPast = date < today;
      const dow    = date.getDay();
      const isBlocked = BLOCKED_DOW.has(dow);
      const isToday   = date.getTime() === today.getTime();
      let cls = "cal-cell";
      let extra = "";
      if (isPast) {
        cls += " muted"; extra = " disabled";
      } else if (isBlocked) {
        cls += " blocked"; extra = " disabled";
      } else {
        cls += " available";
        if (isToday) cls += " today";
        extra = ` data-day="${d}" data-date="${year}-${month+1}-${d}"`;
      }
      html += `<button class="${cls}"${extra}>${d}</button>`;
    }
    // Next-month padding
    const filled = (startDow + totalDays);
    const remainder = filled % 7;
    if (remainder !== 0) {
      for (let d = 1; d <= 7 - remainder; d++) {
        html += `<button class="cal-cell muted" disabled>${d}</button>`;
      }
    }
    return html;
  }

  function renderCalendar() {
    const pubCal = document.getElementById("public-cal");
    const label  = document.getElementById("cal-month-label");
    if (!pubCal) return;
    if (label) label.textContent = `${MONTH_NAMES[calMonth]} ${calYear}`;
    pubCal.innerHTML = buildCalendar(calYear, calMonth);
    // Reset slot panel
    const pubDay  = document.getElementById("public-slot-day");
    const slotList = document.getElementById("public-slot-list");
    if (pubDay)  pubDay.textContent  = "Select a date";
    if (slotList) slotList.innerHTML = `<p style="font-size:13px;color:var(--muted);padding:8px 0;">Pick a date on the left to see available times.</p>`;
    // Disable prev button if we're on the current month
    const prevBtn = document.getElementById("cal-prev");
    if (prevBtn) {
      const now = new Date();
      prevBtn.disabled = (calYear === now.getFullYear() && calMonth === now.getMonth());
    }
  }

  renderCalendar();

  document.getElementById("cal-prev")?.addEventListener("click", () => {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
  });
  document.getElementById("cal-next")?.addEventListener("click", () => {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
  });

  const SLOT_TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00"];

  const pubCal = document.getElementById("public-cal");
  const pubDay = document.getElementById("public-slot-day");
  if (pubCal && pubDay) {
    pubCal.addEventListener("click", (e) => {
      const c = e.target.closest(".cal-cell.available");
      if (!c) return;
      pubCal.querySelectorAll(".selected").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected");
      const d   = c.dataset.day;
      const [y, m, day] = (c.dataset.date || "").split("-").map(Number);
      if (!d) return;
      const date   = new Date(y, m - 1, Number(day));
      const label  = `${DAY_SHORT[date.getDay()]}, ${d} ${MONTH_SHORT[calMonth]}`;
      pubDay.textContent      = label;
      bookingState.date       = `${label} ${calYear}`;
      // Populate slots
      const slotList = document.getElementById("public-slot-list");
      if (slotList) {
        slotList.innerHTML = SLOT_TIMES.map(t =>
          `<button class="slot" type="button">${t}</button>`
        ).join("");
      }
    });
  }

  // Slot list — wrap clicked slot with Next pair
  const slotList = document.getElementById("public-slot-list");
  if (slotList) {
    slotList.addEventListener("click", (e) => {
      const btn = e.target.closest("button.slot");
      if (!btn || btn.classList.contains("next")) return;
      bookingState.time = btn.textContent.trim();
      const endMins = timeToMins(bookingState.time) + bookingState.duration;
      bookingState.endTime = minsToTime(endMins);
      const items = [...slotList.children];
      const flat = items.map((node) => {
        if (node.classList.contains("slot-pair")) {
          const inner = node.querySelector("button.slot");
          return `<button class="slot" type="button">${inner ? inner.textContent.trim() : ""}</button>`;
        }
        return node.outerHTML;
      }).join("");
      slotList.innerHTML = flat;
      const newBtns = [...slotList.querySelectorAll("button.slot")];
      const target = newBtns.find(b => b.textContent.trim() === btn.textContent.trim());
      if (target) {
        const pair = document.createElement("div");
        pair.className = "slot-pair";
        pair.innerHTML = `
          <button class="slot selected" type="button">${target.textContent.trim()}</button>
          <button class="slot next" type="button" onclick="goBookingNext()">Next</button>
        `;
        target.replaceWith(pair);
      }
    });
  }

  // ──────────────────────────────────────────────────
  // Event editor interactivity
  // ──────────────────────────────────────────────────
  const editor = document.getElementById("screen-admin-editor");
  const publicForm = document.querySelector("#screen-public-form .confirm-form");
  const publicFormActions = publicForm?.querySelector(".confirm-actions");

  const bookingState = {
    date: "Tue, 12 May 2026",
    time: "10:30",
    endTime: "11:15",
    eventName: "Your Event",
    duration: 45,
    location: "Google Meet",
  };

  function editorFields() {
    if (!editor) return {};
    const detailPanel = editor.querySelector(".panel .panel-body");
    const inputs = detailPanel ? [...detailPanel.querySelectorAll("input, textarea, select")] : [];
    return {
      title: inputs[0],
      description: inputs[1],
      duration: inputs[2],
      type: inputs[3],
      location: inputs[4],
      slug: inputs[5],
    };
  }

  function editorStatus(message) {
    if (!editor) return;
    let status = editor.querySelector("[data-editor-status]");
    if (!status) {
      status = document.createElement("div");
      status.className = "editor-status";
      status.dataset.editorStatus = "";
      const tabs = editor.querySelector(".tabs");
      tabs?.insertAdjacentElement("afterend", status);
    }
    status.textContent = message;
  }

  function selectedQuestionRows() {
    return [...(editor?.querySelectorAll(".question-row") || [])];
  }

  function questionFromRow(row) {
    const labelEl = row.querySelector(".q-label");
    const label = (labelEl?.textContent || "").replace("*", "").trim();
    const type = row.querySelector(".q-type-badge")?.textContent?.trim() || "Text";
    const meta = row.querySelector(".q-meta span:last-child")?.textContent?.trim() || "";
    return {
      label,
      type,
      required: labelEl?.textContent.includes("*") || meta.toLowerCase().includes("required"),
      active: row.querySelector(".toggle")?.classList.contains("on"),
      builtIn: meta.toLowerCase().includes("built-in")
    };
  }

  function controlForQuestion(question) {
    const required = question.required ? " required" : "";
    if (question.type.toLowerCase().includes("email")) {
      return `<input type="email" placeholder="you@example.com"${required} />`;
    }
    if (question.type.toLowerCase().includes("select")) {
      return `<select${required}>
        <option>1-10 people</option>
        <option selected>11-50 people</option>
        <option>51-200 people</option>
        <option>200+ people</option>
      </select>`;
    }
    if (question.type.toLowerCase().includes("long")) {
      return `<textarea rows="3">Launch planning, pricing, and choosing the right package.</textarea>
        <span class="hint">This helps the host prepare for your session.</span>`;
    }
    const lbl = question.label.toLowerCase();
    const defaultValue = lbl.includes("company")
      ? ""
      : "";
    return `<input type="text" placeholder=""${required} />`;
  }

  function renderPublicBookingForm() {
    if (!publicForm || !publicFormActions || !editor) return;
    [...publicForm.children].forEach(el => {
      if (el.classList.contains("field")) el.remove();
    });
    const questions = selectedQuestionRows()
      .map(questionFromRow)
      .filter(question => question.active);

    questions.forEach(question => {
      const field = document.createElement("div");
      field.className = "field";
      field.dataset.renderedQuestion = "";
      field.innerHTML = `
        <label>${question.label}${question.required ? ' <span class="req">*</span>' : ""}</label>
        ${controlForQuestion(question)}
      `;
      publicFormActions.before(field);
    });
  }

  function updateQuestionCount() {
    const count = selectedQuestionRows().filter(row => row.querySelector(".toggle")?.classList.contains("on")).length;
    const badge = [...(editor?.querySelectorAll(".tab") || [])].find(tab => tab.textContent.includes("Questions"))?.querySelector(".count");
    if (badge) badge.textContent = String(count);
  }

  function syncEditorPreview() {
    if (!editor) return;
    const fields = editorFields();
    const title = fields.title?.value.trim() || "Untitled event";
    const description = fields.description?.value.trim() || "No description added yet.";
    const duration = fields.duration?.value || "45 minutes";
    const location = fields.location?.value || "Zoom";
    const type = fields.type?.value || "One-on-one";
    const slug = fields.slug?.value.trim() || "demo";

    const heading = editor.querySelector(".topbar h2");
    const subtitle = editor.querySelector(".topbar .subtitle");
    if (heading) heading.textContent = title;
    if (subtitle) subtitle.textContent = `bookly.io/you/${slug} · ${duration} · ${location}`;

    document.querySelectorAll("#screen-public-pick .pub-profile h1, #screen-public-form .pub-profile h1").forEach(el => {
      el.textContent = `Book a ${title}`;
    });
    document.querySelectorAll("#screen-public-pick .session-name, #screen-public-form .session-name").forEach(el => {
      el.textContent = title;
    });
    document.querySelectorAll("#screen-public-pick .session-desc, #screen-public-form .session-desc").forEach(el => {
      el.textContent = description;
    });
    document.querySelectorAll("#screen-public-pick .session-meta .row:first-child strong, #screen-public-form .session-meta .row:first-child strong").forEach(el => {
      el.textContent = duration;
    });
    document.querySelectorAll("#screen-public-pick .session-meta .row:nth-child(2), #screen-public-form .session-meta .row:nth-child(2)").forEach(el => {
      el.innerHTML = `<svg><use href="#i-video" /></svg>${location}`;
    });

    editorStatus(`Preview updated: ${type} event at bookly.io/you/${slug}.`);
    updateQuestionCount();
    renderPublicBookingForm();
  }

  function makeQuestionRow({ label = "New custom question", type = "Text", meta = "Optional", required = false } = {}) {
    const row = document.createElement("div");
    row.className = "question-row active";
    row.innerHTML = `
      <svg class="q-handle" width="18" height="18"><use href="#i-handle" /></svg>
      <div class="q-info">
        <div class="q-label">${label}${required ? ' <span class="req">*</span>' : ""}</div>
        <div class="q-meta">
          <span class="q-type-badge">${type}</span>
          <span>${meta}</span>
        </div>
      </div>
      <div style="display: flex; gap: 4px;">
        <span class="toggle on" data-toggle></span>
        <button class="btn btn-icon" type="button" data-delete-question><svg width="15" height="15"><use href="#i-trash" /></svg></button>
      </div>
    `;
    return row;
  }

  const EVENT_CONFIGS = {
    "Training": {
      title: "Training",
      description: "A comprehensive group training session covering skills and development tailored to your team.",
      duration: "60 minutes",
      type: "Group (multiple invitees)",
      location: "Google Meet",
      slug: "training"
    },
    "School": {
      title: "School",
      description: "A focused parent-teacher meeting to discuss your child's progress, goals, and areas of support.",
      duration: "20 minutes",
      type: "One-on-one",
      location: "Zoom",
      slug: "school"
    },
    "Work": {
      title: "Work",
      description: "A productive work appointment for consultations, project check-ins, and professional discussions.",
      duration: "30 minutes",
      type: "One-on-one",
      location: "Google Meet",
      slug: "work"
    },
    "Hospital": {
      title: "Hospital",
      description: "A healthcare consultation for patient follow-ups, care planning, and medical discussions.",
      duration: "25 minutes",
      type: "One-on-one",
      location: "Zoom",
      slug: "hospital"
    },
    "Business (Salon Bar)": {
      title: "Business (Salon Bar)",
      description: "A personal consultation for salon and bar services — styling, treatments, and beauty appointments.",
      duration: "45 minutes",
      type: "One-on-one",
      location: "In-person",
      slug: "salon-bar"
    }
  };

  window.goEdit = function(eventName) {
    const config = EVENT_CONFIGS[eventName];
    if (!config) { go("admin-editor"); return; }

    const editorEl = document.getElementById("screen-admin-editor");
    if (!editorEl) { go("admin-editor"); return; }

    const detailPanel = editorEl.querySelector(".panel .panel-body");
    const inputs = detailPanel ? [...detailPanel.querySelectorAll("input, textarea, select")] : [];

    if (inputs[0]) inputs[0].value = config.title;
    if (inputs[1]) inputs[1].value = config.description;
    if (inputs[2]) {
      for (const o of inputs[2].options) {
        if (o.text === config.duration) { inputs[2].value = o.value; break; }
      }
    }
    if (inputs[3]) {
      for (const o of inputs[3].options) {
        if (o.text === config.type) { inputs[3].value = o.value; break; }
      }
    }
    if (inputs[4]) {
      for (const o of inputs[4].options) {
        if (o.text === config.location) { inputs[4].value = o.value; break; }
      }
    }
    if (inputs[5]) inputs[5].value = config.slug;

    go("admin-editor");
    syncEditorPreview();
  };

  if (editor) {
    const fields = editorFields();
    Object.values(fields).forEach(field => {
      field?.addEventListener("input", syncEditorPreview);
      field?.addEventListener("change", syncEditorPreview);
    });

    const tabs = editor.querySelectorAll(".tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        editorStatus(`${tab.textContent.trim()} selected.`);
      });
    });

    const addQuestionButton = [...editor.querySelectorAll("button")].find(btn => btn.textContent.includes("Add question"));
    addQuestionButton?.addEventListener("click", () => {
      const list = editor.querySelector(".question-list");
      list?.querySelectorAll(".question-row").forEach(row => row.classList.remove("active"));
      const row = makeQuestionRow();
      list?.appendChild(row);
      editorStatus("New question added to the booking form.");
      updateQuestionCount();
      renderPublicBookingForm();
    });

    editor.addEventListener("click", (e) => {
      const row = e.target.closest(".question-row");
      if (row && !e.target.closest("button") && !e.target.closest("[data-toggle]")) {
        editor.querySelectorAll(".question-row").forEach(r => r.classList.remove("active"));
        row.classList.add("active");
        editorStatus(`${questionFromRow(row).label} selected.`);
      }

      const deleteButton = e.target.closest(".question-row .btn-icon:not([disabled])");
      if (deleteButton) {
        const targetRow = deleteButton.closest(".question-row");
        const label = questionFromRow(targetRow).label;
        targetRow.remove();
        editorStatus(`${label} removed from the booking form.`);
        updateQuestionCount();
        renderPublicBookingForm();
      }

      const toggle = e.target.closest(".question-row [data-toggle]");
      if (toggle) {
        e.stopPropagation();
        const targetRow = toggle.closest(".question-row");
        const isOn = toggle.classList.toggle("on");
        targetRow.classList.toggle("off", !isOn);
        editorStatus(`${questionFromRow(targetRow).label} is now ${isOn ? "shown" : "hidden"} on the booking form.`);
        updateQuestionCount();
        renderPublicBookingForm();
      }

      const visibilityToggle = e.target.closest(".panel label [data-toggle]");
      if (visibilityToggle && !visibilityToggle.closest(".question-row")) {
        e.stopPropagation();
        const isOn = visibilityToggle.classList.toggle("on");
        const label = visibilityToggle.closest("label")?.querySelector("strong")?.textContent?.trim() || "Setting";
        editorStatus(`${label} is now ${isOn ? "on" : "off"}.`);
      }
    });

    const saveButton = [...editor.querySelectorAll(".topbar-right .btn")].find(btn => btn.textContent.includes("Save changes"));
    saveButton?.addEventListener("click", () => {
      saveButton.classList.add("active");
      editorStatus("Changes saved. Public booking form is up to date.");
      setTimeout(() => saveButton.classList.remove("active"), 1000);
    });

    const discardButton = [...editor.querySelectorAll(".topbar-right .btn")].find(btn => btn.textContent.includes("Discard"));
    const initialValues = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field?.value || ""]));
    discardButton?.addEventListener("click", () => {
      Object.entries(editorFields()).forEach(([key, field]) => {
        if (field) field.value = initialValues[key] || "";
      });
      editorStatus("Unsaved detail changes discarded.");
      syncEditorPreview();
    });

    const copyUrlButton = editor.querySelector(".field button.btn-ghost");
    copyUrlButton?.addEventListener("click", () => {
      const slug = editorFields().slug?.value.trim() || "demo";
      const url = `bookly.io/you/${slug}`;
      navigator.clipboard?.writeText(url).catch(() => {});
      copyUrlButton.classList.add("active");
      editorStatus(`Copied ${url}`);
      setTimeout(() => copyUrlButton.classList.remove("active"), 1000);
    });

    syncEditorPreview();
  }

  // Cancel booking helper
  window.cancelBooking = function () {
    document.getElementById("cancel-pane").hidden = false;
  };

  // ── Time helpers ────────────────────────────────────────────
  function timeToMins(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }
  function minsToTime(mins) {
    return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  }

  // ── Load event into public booking pages ────────────────────
  window.goPublic = function(eventName) {
    const config = EVENT_CONFIGS[eventName];
    if (!config) { go("public-pick"); return; }

    bookingState.eventName = config.title;
    bookingState.duration = parseInt(config.duration);
    bookingState.location = config.location;

    const isInPerson = config.location === "In-person";
    const locLine = isInPerson
      ? `<svg><use href="#i-pin" /></svg>${config.location}`
      : `<svg><use href="#i-video" /></svg>${config.location} · link in invite`;

    document.querySelectorAll(".pub-profile h1").forEach(el => el.textContent = `Book a ${config.title}`);
    document.querySelectorAll(".session-name").forEach(el => el.textContent = config.title);
    document.querySelectorAll(".session-desc").forEach(el => el.textContent = config.description);
    document.querySelectorAll(".session-meta .row:first-child strong").forEach(el => el.textContent = config.duration);
    document.querySelectorAll("#screen-public-pick .session-meta .row:nth-child(2)").forEach(el => {
      el.innerHTML = locLine;
    });
    document.querySelectorAll("#screen-public-form .session-meta .row:nth-child(2)").forEach(el => {
      el.innerHTML = `<svg><use href="#i-video" /></svg>${config.location}`;
    });

    go("public-pick");
  };

  // ── Move from pick-a-time to details form ───────────────────
  window.goBookingNext = function() {
    const selected = document.querySelector("#public-slot-list .slot.selected");
    if (selected) {
      bookingState.time = selected.textContent.trim();
      bookingState.endTime = minsToTime(timeToMins(bookingState.time) + bookingState.duration);
    }
    const timeRange = `${bookingState.time} – ${bookingState.endTime}`;

    document.querySelectorAll("[data-form-date]").forEach(el => el.textContent = bookingState.date);
    document.querySelectorAll("[data-form-time]").forEach(el => el.textContent = timeRange);

    go("public-form");
  };

  // ── Validate and confirm booking ────────────────────────────
  window.submitBooking = function(form) {
    let valid = true;

    form.querySelectorAll("input[required], select[required]").forEach(field => {
      const wrap = field.closest(".field");
      wrap?.querySelector(".field-error")?.remove();
      field.classList.remove("error");
      if (!field.value.trim()) {
        field.classList.add("error");
        const err = document.createElement("span");
        err.className = "field-error";
        err.textContent = "This field is required.";
        wrap?.appendChild(err);
        valid = false;
      }
    });

    const emailField = form.querySelector('input[type="email"]');
    if (emailField?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add("error");
      const wrap = emailField.closest(".field");
      wrap?.querySelector(".field-error")?.remove();
      const err = document.createElement("span");
      err.className = "field-error";
      err.textContent = "Please enter a valid email address.";
      wrap?.appendChild(err);
      valid = false;
    }

    if (!valid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn?.classList.remove("btn-shake");
      void submitBtn?.offsetWidth;
      submitBtn?.classList.add("btn-shake");
      submitBtn?.addEventListener("animationend", () => submitBtn.classList.remove("btn-shake"), { once: true });
      form.querySelector(".field-error")?.closest(".field")?.querySelector("input, select, textarea")?.focus();
      form.querySelector(".error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.classList.add("btn-loading");
    if (submitBtn) submitBtn.innerHTML = '<svg width="14" height="14"><use href="#i-refresh" /></svg> Confirming…';

    setTimeout(() => {
      submitBtn?.classList.remove("btn-loading");
      if (submitBtn) submitBtn.innerHTML = '<svg width="14" height="14"><use href="#i-check" /></svg> Confirm booking';

      const nameVal = form.querySelector('input[type="text"]')?.value || "Guest";
      const emailVal = form.querySelector('input[type="email"]')?.value || "";
      const timeRange = `${bookingState.time} – ${bookingState.endTime}`;
      const dayLabel = bookingState.date;
      const shortDate = dayLabel.replace(" 2026", "");

      document.querySelectorAll("[data-confirm-date]").forEach(el => el.textContent = dayLabel);
      document.querySelectorAll("[data-confirm-time]").forEach(el => el.textContent = timeRange);
      document.querySelectorAll("[data-confirm-email]").forEach(el => el.textContent = emailVal);
      document.querySelectorAll("[data-confirm-location]").forEach(el => el.textContent = bookingState.location);
      document.querySelectorAll("[data-email-to]").forEach(el => el.textContent = `To: ${emailVal}`);
      document.querySelectorAll("[data-email-subject]").forEach(el =>
        el.textContent = `Your ${bookingState.eventName} is confirmed for ${shortDate}`);
      document.querySelectorAll("[data-email-greeting]").forEach(el =>
        el.textContent = `Hi ${nameVal.split(" ")[0]} — see you soon.`);
      document.querySelectorAll("[data-email-intro]").forEach(el =>
        el.textContent = `Thanks for booking a ${bookingState.eventName}. The meeting is on your calendar and ours. Here are the details:`);
      document.querySelectorAll("[data-email-date]").forEach(el => el.textContent = dayLabel);
      document.querySelectorAll("[data-email-time]").forEach(el => el.textContent = timeRange);
      document.querySelectorAll("[data-email-attendees]").forEach(el =>
        el.textContent = `Host & ${nameVal}`);
      document.querySelectorAll("[data-manage-event]").forEach(el =>
        el.textContent = `${bookingState.eventName} · your booking`);
      document.querySelectorAll("[data-manage-datetime]").forEach(el =>
        el.textContent = `${bookingState.date} at ${bookingState.time}`);
      document.querySelectorAll("[data-manage-name]").forEach(el => el.textContent = nameVal);
      document.querySelectorAll("[data-manage-email]").forEach(el => el.textContent = emailVal);

      go("public-done");
    }, 900);
  };

  // clear field errors on input
  document.querySelector("#screen-public-form")?.addEventListener("input", (e) => {
    const field = e.target;
    if (field.classList.contains("error")) {
      field.classList.remove("error");
      field.closest(".field")?.querySelector(".field-error")?.remove();
    }
  });

  // Boot after everything injected
  if (typeof boot === "function") boot();
})();
