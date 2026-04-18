# Random Thoughts

Random Thoughts ist ein einfacher Blog, den du Schritt für Schritt selbst aufbaust. Als CMS kommt [Statamic](https://statamic.com) zum Einsatz, als Vorlage dient dieses [Figma-Projekt][figma]. Zuerst setzt du das Design statisch mit HTML und Tailwind CSS um. Im zweiten Schritt bindest du Statamic an, sodass die Inhalte dynamisch aus dem CMS geladen werden.

## Voraussetzungen

Bevor es losgeht, installiere folgende Programme und Erweiterungen.

### Programme

- [Laravel Herd](https://herd.laravel.com) — Lokale Entwicklungsumgebung, die PHP-Projekte ohne weitere Konfiguration unter `*.test`-URLs bereitstellt.
- [Git Tower](https://www.git-tower.com) — Grafischer Git-Client, mit dem sich Branches, Commits und Pull Requests ohne Terminal verwalten lassen.
- [Claude Code](https://code.claude.com/docs/en/terminal-guide) — KI-Programmierassistent von Anthropic fürs Terminal und die IDE.

### VSCode-Erweiterungen

- [Antlers Toolbox](https://marketplace.visualstudio.com/items?itemName=stillat-llc.vscode-antlers) — Syntaxhervorhebung, Autovervollständigung und Tooling für Statamics Templating-Sprache Antlers.
- [Laravel](https://marketplace.visualstudio.com/items?itemName=laravel.vscode-laravel) — Die offizielle Laravel-Erweiterung mit Autovervollständigung für Routes, Views, Configs und mehr.
- [Claude Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) — Bindet Claude Code direkt in VSCode ein, damit du ihn beim Coden zur Seite hast.

## Branches

Dieses Repository ist in mehrere Branches aufgeteilt, die jeweils einem Arbeitsschritt entsprechen:

### static
Dein Ausgangspunkt. Hier legst du los. Deine Aufgabe ist es, das Design des [Figma-Projekts][figma] eigenständig in `resources/views/blog.antlers.html` und `resources/views/post.antlers.html` umzusetzen. Als Referenz findest du die fertige statische Version unter <http://random-thoughts.test/static/blog> und <http://random-thoughts.test/static/post>.

### main
Der aktuelle Referenzstand des Projekts.

## Installation

1. Klone dieses Repository in den Ordner `~/Herd`
2. Öffne das Projekt in VSCode
3. Führe im Terminal `cp .env.example .env` aus und ändere in der neuen `.env`-Datei den Wert von `APP_URL` auf `http://random-thoughts.test`
4. Führe `composer install` im Terminal aus, um die Backend-Abhängigkeiten zu installieren
5. Führe `php artisan key:generate` im Terminal aus, um den Anwendungsschlüssel für Laravel zu erzeugen
6. Führe `npm install` im Terminal aus, um die Frontend-Abhängigkeiten zu installieren
7. Führe `npm run dev` im Terminal aus, um den Frontend-Build-Prozess zu starten

## In Statamic einloggen

Logge dich unter <http://random-thoughts.test/cp> mit dem Benutzernamen `coding@basics.ch` und dem Passwort `codingbasics` ein.

## Links

- [Figma Projekt][figma]
- [Statamic Website](https://statamic.com)
- [Statamic Docs](https://statamic.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Alpine.js](https://alpinejs.dev/start-here)

[figma]: https://www.figma.com/design/O5nrefeUlq0FcjrNEjFXeP/Random-Thoughts--Copy-?node-id=1-341&p=f&t=qe6qjwtxAbO6Ihq8-0
