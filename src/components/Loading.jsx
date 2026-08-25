const Loading = ({ size = 'md', text, fullScreen = false }) => {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' }
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} rounded-full border-gray-200 border-t-brand-orange animate-spin`} />
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  )
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }
  return <div className="flex items-center justify-center py-12">{spinner}</div>
}

export default Loading
