# 音乐播放器模块（可拆卸）

## 移除方式
1. 删除整个 `src/components/player/` 目录
2. 在 `src/components/layout/Layout.tsx` 中删除 `<MusicPlayer />` 引入与挂载
3. 在 `src/App.tsx` 中无需改动（无路由）

## 文件
- `MusicPlayer.tsx` - 主组件
- `index.ts` - 桶导出
- `player.css` - 进度条样式（在 index.css 中已通过 neon-range 类直接处理）

## 配置
后台 `/admin/music` 维护歌单/音量/循环模式/总开关
