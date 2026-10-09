type IconName = "arrow-up-right" | "arrow-down" | "download" | "menu" | "close" | "pause" | "play" | "arrow-up";
const paths: Record<IconName,string> = {
  "arrow-up-right":"M7 17 17 7M7 7h10v10",
  "arrow-down":"M12 4v16m-6-6 6 6 6-6",
  "download":"M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4",
  "menu":"M4 7h16M4 12h16M4 17h16",
  "close":"m6 6 12 12M6 18 18 6",
  "pause":"M8 5v14M16 5v14",
  "play":"m8 4 12 8-12 8Z",
  "arrow-up":"M12 20V4m-6 6 6-6 6 6",
};
export default function Icon({name,className=""}:{name:IconName;className?:string}) {
  return <svg className={`ui-icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]}/></svg>;
}
