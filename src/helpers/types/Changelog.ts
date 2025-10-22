export type Changelog = {
  version: string;
  date: string; // format ISO, ex: "2025-09-29T12:00:00.000Z"
  version_name: string;
  breaking: boolean;
  changes: string[];
  visible: boolean;
}