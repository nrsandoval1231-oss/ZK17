/** Owner-approved identity assets. Presentation components consume these paths. */
export const brand = {
  name: 'ZK17',
  monogram: {
    src: '/brand/zk17-monogram-512-v2.png',
    alt: 'ZK17 sword monogram',
    width: 512,
    height: 512,
    aspectRatio: 1,
    source: 'brand/zk17-monogram-master.jpg',
    sourceSha256: '6bb5f0a9598b91f5ba79f4935a0b2835d3d260eb4a537a1554e594a2d8864736',
    ownerApproved: true,
  },
} as const;
